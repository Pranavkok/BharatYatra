import { WebSocket } from 'ws';
import { gameManager, INDIA_MAP } from './gameState.js';
import { clientMessageSchema, type ServerMessage } from '../types/ws.types.js';
import type { Quiz, CardType } from '../types/game.types.js';
import { GAME_CONFIG, CARD_COSTS } from '../types/game.types.js';
import { generateQuiz, generateRegionInfo } from '../services/gemini.service.js';
import { prisma } from '../db.js';

// Connection manager for broadcasting
class ConnectionManager {
  private connections: Map<string, Map<string, WebSocket>> = new Map(); // roomId -> playerId -> ws
  private playerRooms: Map<WebSocket, { roomId: string; playerId: string }> = new Map();

  addConnection(roomId: string, playerId: string, ws: WebSocket) {
    if (!this.connections.has(roomId)) {
      this.connections.set(roomId, new Map());
    }
    this.connections.get(roomId)!.set(playerId, ws);
    this.playerRooms.set(ws, { roomId, playerId });
  }

  removeConnection(ws: WebSocket) {
    const info = this.playerRooms.get(ws);
    if (info) {
      const { roomId, playerId } = info;
      const roomConnections = this.connections.get(roomId);
      if (roomConnections) {
        roomConnections.delete(playerId);
        if (roomConnections.size === 0) {
          this.connections.delete(roomId);
        }
      }
      this.playerRooms.delete(ws);
    }
    return info;
  }

  getConnectionInfo(ws: WebSocket) {
    return this.playerRooms.get(ws);
  }

  broadcast(roomId: string, message: ServerMessage, excludePlayerId?: string) {
    const roomConnections = this.connections.get(roomId);
    if (!roomConnections) return;

    const data = JSON.stringify(message);
    roomConnections.forEach((ws, playerId) => {
      if (playerId !== excludePlayerId && ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }

  send(roomId: string, playerId: string, message: ServerMessage) {
    const roomConnections = this.connections.get(roomId);
    if (!roomConnections) return;

    const ws = roomConnections.get(playerId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  sendAll(roomId: string, message: ServerMessage) {
    this.broadcast(roomId, message);
  }
}

const connectionManager = new ConnectionManager();

function sendError(ws: WebSocket, message: string) {
  ws.send(JSON.stringify({ type: 'ERROR', message }));
}

function sendMessage(ws: WebSocket, message: ServerMessage) {
  ws.send(JSON.stringify(message));
}

export const handleConnection = (ws: WebSocket) => {
  console.log('New WebSocket connection');

  ws.on('message', async (rawMessage: string) => {
    try {
      const parsed = JSON.parse(rawMessage);
      const result = clientMessageSchema.safeParse(parsed);

      if (!result.success) {
        console.error('Invalid message format', result.error.issues);
        sendError(ws, 'Invalid message format');
        return;
      }

      const { type, payload } = result.data;

      // Handle CREATE_ROOM
      if (type === 'CREATE_ROOM') {
        const { roomName, playerName } = payload;

        // Create room in DB
        const dbRoom = await prisma.room.create({
          data: { name: roomName, status: 'WAITING' }
        });

        // Create room in memory
        const room = gameManager.createRoom(dbRoom.id);
        const addResult = gameManager.addPlayer(dbRoom.id, playerName);

        if (!addResult) {
          sendError(ws, 'Failed to create room');
          return;
        }

        connectionManager.addConnection(dbRoom.id, addResult.player.id, ws);

        sendMessage(ws, {
          type: 'ROOM_CREATED',
          payload: { roomId: dbRoom.id, playerId: addResult.player.id }
        });

        sendMessage(ws, { type: 'ROOM_STATE', payload: addResult.room });
        return;
      }

      // Handle JOIN_ROOM
      if (type === 'JOIN_ROOM') {
        const { roomId, playerName } = payload;

        // Create room if doesn't exist (for direct join via room code)
        if (!gameManager.getRoom(roomId)) {
          const dbRoom = await prisma.room.findUnique({ where: { id: roomId } });
          if (!dbRoom) {
            gameManager.createRoom(roomId);
          }
        }

        const addResult = gameManager.addPlayer(roomId, playerName);
        if (!addResult) {
          sendError(ws, 'Could not join room. Room may be full, game may have started, or name already taken.');
          return;
        }

        connectionManager.addConnection(roomId, addResult.player.id, ws);

        // Send player their ID and current room state
        sendMessage(ws, {
          type: 'ROOM_CREATED',
          payload: { roomId, playerId: addResult.player.id }
        });

        sendMessage(ws, { type: 'ROOM_STATE', payload: addResult.room });

        // Broadcast to others
        connectionManager.broadcast(roomId, {
          type: 'PLAYER_JOINED',
          payload: { player: addResult.player, players: addResult.room.players }
        }, addResult.player.id);

        // Auto-start when 4 players join
        if (addResult.room.players.length === GAME_CONFIG.MAX_PLAYERS) {
          const startedRoom = gameManager.startGame(roomId);
          if (startedRoom) {
            connectionManager.sendAll(roomId, { type: 'GAME_STARTED', payload: startedRoom });
          }
        }

        return;
      }

      // For all other messages, player must be connected
      const connInfo = connectionManager.getConnectionInfo(ws);
      if (!connInfo) {
        sendError(ws, 'Not connected to a room');
        return;
      }

      const { roomId, playerId } = connInfo;
      const room = gameManager.getRoom(roomId);
      if (!room) {
        sendError(ws, 'Room not found');
        return;
      }

      // Handle ROLL_DICE
      if (type === 'ROLL_DICE') {
        if (payload.playerId !== playerId) {
          sendError(ws, 'Invalid player');
          return;
        }

        const rollResult = gameManager.rollDice(roomId, playerId);

        if (!rollResult) {
          // Check if player was blocked
          const currentRoom = gameManager.getRoom(roomId);
          if (currentRoom) {
            const wasBlocked = currentRoom.players.find(p => p.id === playerId)?.isBlocked === false;
            if (wasBlocked) {
              connectionManager.sendAll(roomId, {
                type: 'PLAYER_BLOCKED',
                payload: { playerId, blockedByPlayerId: 'system' }
              });
              connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: currentRoom });
            }
          }
          sendError(ws, 'Cannot roll dice now');
          return;
        }

        connectionManager.sendAll(roomId, {
          type: 'DICE_ROLLED',
          payload: {
            playerId,
            value: rollResult.diceValue,
            validMoves: rollResult.validMoves
          }
        });

        connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: rollResult.room });
        return;
      }

      // Handle MOVE_PLAYER
      if (type === 'MOVE_PLAYER') {
        if (payload.playerId !== playerId) {
          sendError(ws, 'Invalid player');
          return;
        }

        const moveResult = gameManager.movePlayer(roomId, playerId, payload.targetNodeId);
        if (!moveResult) {
          sendError(ws, 'Invalid move');
          return;
        }

        connectionManager.sendAll(roomId, {
          type: 'PLAYER_MOVED',
          payload: {
            playerId,
            nodeId: payload.targetNodeId,
            remainingMoves: moveResult.room.remainingMoves
          }
        });

        // Handle special events
        for (const event of moveResult.events) {
          if (event === 'TREASURE') {
            const player = moveResult.room.players.find(p => p.id === playerId);
            connectionManager.sendAll(roomId, {
              type: 'TREASURE_FOUND',
              payload: {
                playerId,
                nodeId: payload.targetNodeId,
                starsGained: GAME_CONFIG.TREASURE_REWARD_STARS
              }
            });
          }

          if (event === 'FAIRY') {
            connectionManager.sendAll(roomId, {
              type: 'FAIRY_REACHED',
              payload: { playerId, fairyNodeId: moveResult.room.fairyNodeId }
            });
          }

          if (event === 'SHOP') {
            connectionManager.sendAll(roomId, {
              type: 'SHOP_REACHED',
              payload: { playerId, shopNodeId: payload.targetNodeId }
            });
          }

          if (event === 'WIN') {
            await handleGameOver(roomId, playerId);
            return;
          }
        }

        connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: moveResult.room });

        // Generate quiz if needed
        if (moveResult.room.turnPhase === 'QUIZ') {
          await generateAndSendQuiz(roomId, playerId, payload.targetNodeId);
        }

        return;
      }

      // Handle ANSWER_QUIZ
      if (type === 'ANSWER_QUIZ') {
        if (payload.playerId !== playerId) {
          sendError(ws, 'Invalid player');
          return;
        }

        const answerResult = gameManager.answerQuiz(roomId, playerId, payload.answerIndex);
        if (!answerResult) {
          sendError(ws, 'Cannot answer quiz now');
          return;
        }

        connectionManager.sendAll(roomId, {
          type: 'QUIZ_ANSWERED',
          payload: {
            playerId,
            correct: answerResult.correct,
            coinsChange: answerResult.coinsChange,
            newCoins: answerResult.room.players.find(p => p.id === playerId)!.coins,
            hasAnswerCard: answerResult.hasAnswerCard
          }
        });

        connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: answerResult.room });
        return;
      }

      // Handle END_TURN
      if (type === 'END_TURN') {
        if (payload.playerId !== playerId) {
          sendError(ws, 'Invalid player');
          return;
        }

        const currentRoom = gameManager.getRoom(roomId);
        if (!currentRoom || currentRoom.turnPhase !== 'TURN_ENDED') {
          sendError(ws, 'Cannot end turn now');
          return;
        }

        const previousPlayer = currentRoom.players[currentRoom.currentTurnIndex];
        if (!previousPlayer) {
          sendError(ws, 'No current player found');
          return;
        }
        const previousPlayerId = previousPlayer.id;
        const nextRoom = gameManager.nextTurn(roomId);
        if (!nextRoom) {
          sendError(ws, 'Failed to advance turn');
          return;
        }

        const currentPlayer = nextRoom.players[nextRoom.currentTurnIndex];
        if (!currentPlayer) {
          sendError(ws, 'No next player found');
          return;
        }

        connectionManager.sendAll(roomId, {
          type: 'TURN_CHANGED',
          payload: {
            currentPlayerId: currentPlayer.id,
            currentTurnIndex: nextRoom.currentTurnIndex,
            previousPlayerId
          }
        });

        connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: nextRoom });
        return;
      }

      // Handle FAIRY_INTERACTION
      if (type === 'FAIRY_INTERACTION') {
        if (payload.playerId !== playerId) {
          sendError(ws, 'Invalid player');
          return;
        }

        if (payload.action === 'SKIP') {
          const skippedRoom = gameManager.skipFairy(roomId, playerId);
          if (!skippedRoom) {
            sendError(ws, 'Cannot skip fairy interaction');
            return;
          }
          connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: skippedRoom });

          // Generate quiz
          const player = skippedRoom.players.find(p => p.id === playerId);
          if (player) {
            await generateAndSendQuiz(roomId, playerId, player.currentNodeId);
          }
          return;
        }

        // EXCHANGE
        const starsToExchange = payload.starsToExchange || 1;
        const exchangeResult = gameManager.fairyExchange(roomId, playerId, starsToExchange);
        if (!exchangeResult) {
          sendError(ws, 'Cannot exchange with fairy. Not enough coins.');
          return;
        }

        connectionManager.sendAll(roomId, {
          type: 'FAIRY_EXCHANGED',
          payload: {
            playerId,
            starsGained: exchangeResult.starsGained,
            coinsSpent: exchangeResult.coinsSpent,
            newFairyNodeId: exchangeResult.room.fairyNodeId
          }
        });

        // Check win
        const player = exchangeResult.room.players.find(p => p.id === playerId);
        if (player && player.stars >= GAME_CONFIG.WIN_STARS) {
          await handleGameOver(roomId, playerId);
          return;
        }

        connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: exchangeResult.room });

        // Generate quiz
        if (player) {
          await generateAndSendQuiz(roomId, playerId, player.currentNodeId);
        }
        return;
      }

      // Handle SHOP_ACTION
      if (type === 'SHOP_ACTION') {
        if (payload.playerId !== playerId) {
          sendError(ws, 'Invalid player');
          return;
        }

        if (payload.action === 'SKIP') {
          const skippedRoom = gameManager.skipShop(roomId, playerId);
          if (!skippedRoom) {
            sendError(ws, 'Cannot skip shop');
            return;
          }
          connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: skippedRoom });

          // Generate quiz
          const player = skippedRoom.players.find(p => p.id === playerId);
          if (player) {
            await generateAndSendQuiz(roomId, playerId, player.currentNodeId);
          }
          return;
        }

        if (payload.action === 'BUY_STAR') {
          const buyResult = gameManager.buyStarFromShop(roomId, playerId);
          if (!buyResult) {
            sendError(ws, 'Cannot buy star. Not enough coins (need 5000).');
            return;
          }

          connectionManager.sendAll(roomId, {
            type: 'STAR_PURCHASED',
            payload: {
              playerId,
              stars: buyResult.stars,
              coinsSpent: GAME_CONFIG.SHOP_STAR_COST
            }
          });

          // Check win
          const player = buyResult.room.players.find(p => p.id === playerId);
          if (player && player.stars >= GAME_CONFIG.WIN_STARS) {
            await handleGameOver(roomId, playerId);
            return;
          }

          connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: buyResult.room });
          return;
        }

        if (payload.action === 'BUY_CARD' && payload.cardType) {
          const buyResult = gameManager.buyCard(roomId, playerId, payload.cardType as CardType);
          if (!buyResult) {
            sendError(ws, `Cannot buy card. Not enough coins (need ${CARD_COSTS[payload.cardType as CardType]}).`);
            return;
          }

          connectionManager.sendAll(roomId, {
            type: 'CARD_PURCHASED',
            payload: {
              playerId,
              card: buyResult.card,
              coinsSpent: CARD_COSTS[payload.cardType as CardType]
            }
          });

          connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: buyResult.room });
          return;
        }

        sendError(ws, 'Invalid shop action');
        return;
      }

      // Handle USE_CARD
      if (type === 'USE_CARD') {
        if (payload.playerId !== playerId) {
          sendError(ws, 'Invalid player');
          return;
        }

        const useResult = gameManager.useCard(roomId, playerId, payload.cardId, payload.targetPlayerId);
        if (!useResult) {
          sendError(ws, 'Cannot use card');
          return;
        }

        connectionManager.sendAll(roomId, {
          type: 'CARD_USED',
          payload: {
            playerId,
            card: useResult.card,
            ...(payload.targetPlayerId ? { targetPlayerId: payload.targetPlayerId } : {}),
            effect: useResult.effect
          }
        });

        if (useResult.card.type === 'TELEPORT') {
          const player = useResult.room.players.find(p => p.id === playerId);
          connectionManager.sendAll(roomId, {
            type: 'PLAYER_TELEPORTED',
            payload: { playerId, newNodeId: player!.currentNodeId }
          });
        }

        if (useResult.card.type === 'BLOCK' && payload.targetPlayerId) {
          connectionManager.sendAll(roomId, {
            type: 'PLAYER_BLOCKED',
            payload: { playerId: payload.targetPlayerId, blockedByPlayerId: playerId }
          });
        }

        connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: useResult.room });
        return;
      }

      // Handle LEARN_REGION
      if (type === 'LEARN_REGION') {
        const node = INDIA_MAP.find(n => n.id === payload.nodeId);
        if (!node) {
          sendError(ws, 'Node not found');
          return;
        }

        const info = await generateRegionInfo(node.name, node.region);
        sendMessage(ws, {
          type: 'REGION_INFO',
          payload: {
            nodeId: node.id,
            nodeName: node.name,
            info
          }
        });
        return;
      }

    } catch (error) {
      console.error('WebSocket Error:', error);
      sendError(ws, 'Internal server error');
    }
  });

  ws.on('close', () => {
    const info = connectionManager.removeConnection(ws);
    if (info) {
      console.log(`Player ${info.playerId} disconnected from room ${info.roomId}`);

      // Remove player from game
      const room = gameManager.removePlayer(info.roomId, info.playerId);
      if (room) {
        connectionManager.broadcast(info.roomId, {
          type: 'PLAYER_LEFT',
          payload: { playerId: info.playerId, players: room.players }
        });
        connectionManager.sendAll(info.roomId, { type: 'ROOM_STATE', payload: room });
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
};

// Helper to generate and send quiz
async function generateAndSendQuiz(roomId: string, playerId: string, nodeId: string) {
  const node = INDIA_MAP.find(n => n.id === nodeId);
  if (!node) return;

  const quizData = await generateQuiz(node.name, node.region);
  const quiz: Quiz = {
    ...quizData,
    nodeId,
    playerId
  };

  gameManager.setQuiz(roomId, quiz);

  connectionManager.sendAll(roomId, {
    type: 'QUIZ_GENERATED',
    payload: quiz
  });
}

// Helper to handle game over
async function handleGameOver(roomId: string, winnerId: string) {
  const room = gameManager.getRoom(roomId);
  if (!room) return;

  const winner = room.players.find(p => p.id === winnerId);
  if (!winner) return;

  // Save to DB
  try {
    await prisma.room.update({
      where: { id: roomId },
      data: { status: 'FINISHED' }
    });

    await prisma.gameResult.create({
      data: { roomId, winnerId }
    });
  } catch (err) {
    console.error('Failed to save game result:', err);
  }

  connectionManager.sendAll(roomId, {
    type: 'GAME_OVER',
    payload: {
      winnerId,
      winnerName: winner.name,
      finalScores: room.players.map(p => ({
        playerId: p.id,
        name: p.name,
        stars: p.stars,
        coins: p.coins
      }))
    }
  });

  connectionManager.sendAll(roomId, { type: 'ROOM_STATE', payload: room });
}
