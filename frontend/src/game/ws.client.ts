import { useGameStore } from './store';
import type { ServerMessage, CardType } from './types';

const WS_URL = 'ws://localhost:3000';

class GameClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(WS_URL);

        this.ws.onopen = () => {
          console.log('Connected to Game Server');
          this.reconnectAttempts = 0;
          useGameStore.getState().setConnected(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data: ServerMessage = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (e) {
            console.error('WS Message Parse Error', e);
          }
        };

        this.ws.onclose = () => {
          console.log('Disconnected from Game Server');
          useGameStore.getState().setConnected(false);
          this.attemptReconnect();
        };

        this.ws.onerror = (e) => {
          console.error('WS Error', e);
          reject(e);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => this.connect(), 2000);
    }
  }

  private handleMessage(data: ServerMessage) {
    const store = useGameStore.getState();

    switch (data.type) {
      case 'ERROR':
        store.addNotification('error', data.message);
        break;

      case 'ROOM_CREATED':
        store.setRoomId(data.payload.roomId);
        store.setPlayerId(data.payload.playerId);
        break;

      case 'ROOM_STATE':
        store.setGameState(data.payload);
        // Handle turn phase changes
        if (data.payload.turnPhase === 'QUIZ' && data.payload.currentQuiz) {
          store.setCurrentQuiz(data.payload.currentQuiz);
          store.setShowQuizModal(true);
        }
        if (data.payload.turnPhase === 'FAIRY_INTERACTION') {
          const myPlayer = store.getMyPlayer();
          if (myPlayer?.isTurn) {
            store.setShowFairyModal(true);
          }
        }
        if (data.payload.turnPhase === 'SHOP') {
          const myPlayer = store.getMyPlayer();
          if (myPlayer?.isTurn) {
            store.setShowShopModal(true);
          }
        }
        break;

      case 'PLAYER_JOINED':
        store.addNotification('info', `${data.payload.player.name} joined the game`);
        break;

      case 'PLAYER_LEFT':
        store.addNotification('warning', 'A player left the game');
        break;

      case 'GAME_STARTED':
        store.setGameState(data.payload);
        store.addNotification('success', 'Game started! Good luck!');
        break;

      case 'DICE_ROLLED':
        store.setDiceRoll(data.payload.value, data.payload.validMoves);
        if (data.payload.playerId === store.playerId) {
          store.addNotification('info', `You rolled a ${data.payload.value}!`);
        } else {
          const player = store.gameState?.players.find(p => p.id === data.payload.playerId);
          store.addNotification('info', `${player?.name || 'Player'} rolled a ${data.payload.value}`);
        }
        break;

      case 'PLAYER_MOVED':
        // Clear dice after final move
        if (data.payload.remainingMoves === 0) {
          store.setDiceRoll(null, []);
        }
        break;

      case 'QUIZ_GENERATED':
        store.setCurrentQuiz(data.payload);
        if (data.payload.playerId === store.playerId) {
          store.setShowQuizModal(true);
        }
        break;

      case 'QUIZ_ANSWERED':
        if (data.payload.playerId === store.playerId) {
          store.setLastQuizResult({
            correct: data.payload.correct,
            coinsChange: data.payload.coinsChange,
          });
          if (data.payload.hasAnswerCard) {
            store.addNotification('success', 'Answer Card saved you! Auto-corrected answer.');
          } else if (data.payload.correct) {
            store.addNotification('success', `Correct! +${data.payload.coinsChange} coins`);
          } else {
            store.addNotification('error', `Wrong! ${data.payload.coinsChange} coins`);
          }
        }
        store.setShowQuizModal(false);
        store.setCurrentQuiz(null);
        break;

      case 'FAIRY_REACHED':
        if (data.payload.playerId === store.playerId) {
          store.setShowFairyModal(true);
          store.addNotification('info', 'You found the Fairy! Exchange coins for stars!');
        } else {
          const player = store.gameState?.players.find(p => p.id === data.payload.playerId);
          store.addNotification('info', `${player?.name || 'Player'} found the Fairy!`);
        }
        break;

      case 'FAIRY_EXCHANGED':
        store.setShowFairyModal(false);
        if (data.payload.playerId === store.playerId) {
          store.addNotification('success', `Exchanged ${data.payload.coinsSpent} coins for ${data.payload.starsGained} star(s)!`);
        }
        break;

      case 'SHOP_REACHED':
        if (data.payload.playerId === store.playerId) {
          store.setShowShopModal(true);
          store.addNotification('info', 'Welcome to the Shop!');
        }
        break;

      case 'CARD_PURCHASED':
        if (data.payload.playerId === store.playerId) {
          store.addNotification('success', `Purchased ${data.payload.card.type} card!`);
        }
        break;

      case 'STAR_PURCHASED':
        if (data.payload.playerId === store.playerId) {
          store.addNotification('success', 'Purchased a Star!');
        }
        break;

      case 'CARD_USED':
        store.addNotification('info', data.payload.effect);
        break;

      case 'PLAYER_BLOCKED':
        const blockedPlayer = store.gameState?.players.find(p => p.id === data.payload.playerId);
        store.addNotification('warning', `${blockedPlayer?.name || 'Player'} is blocked for next turn!`);
        break;

      case 'PLAYER_TELEPORTED':
        if (data.payload.playerId === store.playerId) {
          store.addNotification('info', 'You were teleported!');
        }
        break;

      case 'TREASURE_FOUND':
        const finder = store.gameState?.players.find(p => p.id === data.payload.playerId);
        if (data.payload.playerId === store.playerId) {
          store.addNotification('success', `Treasure found! +${data.payload.starsGained} Star!`);
        } else {
          store.addNotification('info', `${finder?.name || 'Player'} found a treasure!`);
        }
        break;

      case 'TURN_CHANGED':
        store.setDiceRoll(null, []);
        if (data.payload.currentPlayerId === store.playerId) {
          store.addNotification('info', "It's your turn!");
        }
        break;

      case 'REGION_INFO':
        store.setShowRegionInfo(data.payload);
        break;

      case 'GAME_OVER':
        store.setGameOverData(data.payload);
        store.setShowGameOverModal(true);
        if (data.payload.winnerId === store.playerId) {
          store.addNotification('success', 'Congratulations! You won!');
        } else {
          store.addNotification('info', `${data.payload.winnerName} wins the game!`);
        }
        break;
    }
  }

  private send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WS not connected');
      useGameStore.getState().addNotification('error', 'Not connected to server');
    }
  }

  // Actions
  createRoom(roomName: string, playerName: string) {
    this.send('CREATE_ROOM', { roomName, playerName });
  }

  joinRoom(roomId: string, playerName: string) {
    this.send('JOIN_ROOM', { roomId, playerName });
  }

  rollDice() {
    const store = useGameStore.getState();
    this.send('ROLL_DICE', { roomId: store.roomId, playerId: store.playerId });
  }

  movePlayer(targetNodeId: string) {
    const store = useGameStore.getState();
    this.send('MOVE_PLAYER', { roomId: store.roomId, playerId: store.playerId, targetNodeId });
  }

  answerQuiz(answerIndex: number) {
    const store = useGameStore.getState();
    this.send('ANSWER_QUIZ', { roomId: store.roomId, playerId: store.playerId, answerIndex });
  }

  fairyInteraction(action: 'EXCHANGE' | 'SKIP', starsToExchange?: number) {
    const store = useGameStore.getState();
    this.send('FAIRY_INTERACTION', {
      roomId: store.roomId,
      playerId: store.playerId,
      action,
      starsToExchange
    });
  }

  shopAction(action: 'BUY_STAR' | 'BUY_CARD' | 'SKIP', cardType?: CardType) {
    const store = useGameStore.getState();
    this.send('SHOP_ACTION', {
      roomId: store.roomId,
      playerId: store.playerId,
      action,
      cardType
    });
  }

  useCard(cardId: string, targetPlayerId?: string) {
    const store = useGameStore.getState();
    this.send('USE_CARD', {
      roomId: store.roomId,
      playerId: store.playerId,
      cardId,
      targetPlayerId
    });
  }

  endTurn() {
    const store = useGameStore.getState();
    this.send('END_TURN', { roomId: store.roomId, playerId: store.playerId });
  }

  learnRegion(nodeId: string) {
    const store = useGameStore.getState();
    this.send('LEARN_REGION', { roomId: store.roomId, nodeId });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const gameClient = new GameClient();
