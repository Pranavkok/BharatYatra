import type { GameRoom, PlayerState, GameNode, Card, CardType, Quiz } from '../types/game.types.js';
import { GAME_CONFIG, CARD_COSTS } from '../types/game.types.js';
import { v4 as uuidv4 } from 'uuid';

// Complete India map with node types
export const INDIA_MAP: GameNode[] = [
  // South India
  { id: 'kanyakumari', name: 'Kanyakumari', x: 400, y: 920, region: 'Tamil Nadu', neighbors: ['chennai', 'madurai', 'trivandrum'], nodeType: 'START' },
  { id: 'trivandrum', name: 'Thiruvananthapuram', x: 340, y: 880, region: 'Kerala', neighbors: ['kanyakumari', 'kochi'], nodeType: 'REGULAR' },
  { id: 'kochi', name: 'Kochi', x: 320, y: 830, region: 'Kerala', neighbors: ['trivandrum', 'bangalore', 'mysore'], nodeType: 'SHOP' },
  { id: 'madurai', name: 'Madurai', x: 410, y: 850, region: 'Tamil Nadu', neighbors: ['kanyakumari', 'chennai', 'coimbatore'], nodeType: 'REGULAR' },
  { id: 'coimbatore', name: 'Coimbatore', x: 380, y: 810, region: 'Tamil Nadu', neighbors: ['madurai', 'mysore', 'bangalore'], nodeType: 'REGULAR' },
  { id: 'mysore', name: 'Mysore', x: 390, y: 770, region: 'Karnataka', neighbors: ['kochi', 'coimbatore', 'bangalore'], nodeType: 'REGULAR' },
  { id: 'chennai', name: 'Chennai', x: 490, y: 780, region: 'Tamil Nadu', neighbors: ['kanyakumari', 'madurai', 'bangalore', 'hyderabad', 'visakhapatnam'], nodeType: 'SHOP' },
  { id: 'bangalore', name: 'Bangalore', x: 430, y: 720, region: 'Karnataka', neighbors: ['mysore', 'coimbatore', 'chennai', 'hyderabad', 'goa'], nodeType: 'REGULAR' },

  // West India
  { id: 'goa', name: 'Goa', x: 280, y: 660, region: 'Goa', neighbors: ['bangalore', 'mumbai'], nodeType: 'REGULAR' },
  { id: 'mumbai', name: 'Mumbai', x: 260, y: 560, region: 'Maharashtra', neighbors: ['goa', 'pune', 'ahmedabad', 'nagpur'], nodeType: 'SHOP' },
  { id: 'pune', name: 'Pune', x: 300, y: 600, region: 'Maharashtra', neighbors: ['mumbai', 'hyderabad', 'nagpur'], nodeType: 'REGULAR' },
  { id: 'ahmedabad', name: 'Ahmedabad', x: 180, y: 420, region: 'Gujarat', neighbors: ['mumbai', 'jaipur', 'udaipur'], nodeType: 'REGULAR' },
  { id: 'udaipur', name: 'Udaipur', x: 220, y: 380, region: 'Rajasthan', neighbors: ['ahmedabad', 'jaipur'], nodeType: 'REGULAR' },

  // Central India
  { id: 'hyderabad', name: 'Hyderabad', x: 480, y: 640, region: 'Telangana', neighbors: ['chennai', 'bangalore', 'pune', 'nagpur', 'visakhapatnam'], nodeType: 'REGULAR' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', x: 570, y: 620, region: 'Andhra Pradesh', neighbors: ['chennai', 'hyderabad', 'bhubaneswar'], nodeType: 'REGULAR' },
  { id: 'nagpur', name: 'Nagpur', x: 450, y: 520, region: 'Maharashtra', neighbors: ['mumbai', 'pune', 'hyderabad', 'bhopal', 'raipur'], nodeType: 'REGULAR' },
  { id: 'bhopal', name: 'Bhopal', x: 390, y: 470, region: 'Madhya Pradesh', neighbors: ['nagpur', 'jaipur', 'lucknow', 'indore'], nodeType: 'SHOP' },
  { id: 'indore', name: 'Indore', x: 320, y: 480, region: 'Madhya Pradesh', neighbors: ['bhopal', 'udaipur'], nodeType: 'REGULAR' },
  { id: 'raipur', name: 'Raipur', x: 550, y: 500, region: 'Chhattisgarh', neighbors: ['nagpur', 'bhubaneswar'], nodeType: 'REGULAR' },

  // East India
  { id: 'bhubaneswar', name: 'Bhubaneswar', x: 670, y: 530, region: 'Odisha', neighbors: ['visakhapatnam', 'raipur', 'kolkata'], nodeType: 'REGULAR' },
  { id: 'kolkata', name: 'Kolkata', x: 730, y: 440, region: 'West Bengal', neighbors: ['bhubaneswar', 'patna', 'guwahati'], nodeType: 'SHOP' },
  { id: 'patna', name: 'Patna', x: 630, y: 370, region: 'Bihar', neighbors: ['kolkata', 'varanasi', 'lucknow'], nodeType: 'REGULAR' },
  { id: 'guwahati', name: 'Guwahati', x: 810, y: 340, region: 'Assam', neighbors: ['kolkata', 'shillong'], nodeType: 'REGULAR' },
  { id: 'shillong', name: 'Shillong', x: 840, y: 360, region: 'Meghalaya', neighbors: ['guwahati'], nodeType: 'REGULAR' },

  // North India
  { id: 'varanasi', name: 'Varanasi', x: 560, y: 350, region: 'Uttar Pradesh', neighbors: ['patna', 'lucknow', 'allahabad'], nodeType: 'REGULAR' },
  { id: 'allahabad', name: 'Prayagraj', x: 530, y: 370, region: 'Uttar Pradesh', neighbors: ['varanasi', 'lucknow'], nodeType: 'REGULAR' },
  { id: 'lucknow', name: 'Lucknow', x: 490, y: 320, region: 'Uttar Pradesh', neighbors: ['bhopal', 'patna', 'varanasi', 'allahabad', 'delhi', 'agra'], nodeType: 'REGULAR' },
  { id: 'agra', name: 'Agra', x: 430, y: 310, region: 'Uttar Pradesh', neighbors: ['lucknow', 'delhi', 'jaipur'], nodeType: 'REGULAR' },
  { id: 'jaipur', name: 'Jaipur', x: 330, y: 330, region: 'Rajasthan', neighbors: ['udaipur', 'ahmedabad', 'bhopal', 'agra', 'delhi'], nodeType: 'SHOP' },
  { id: 'delhi', name: 'New Delhi', x: 380, y: 270, region: 'Delhi', neighbors: ['jaipur', 'agra', 'lucknow', 'chandigarh', 'dehradun'], nodeType: 'REGULAR' },
  { id: 'chandigarh', name: 'Chandigarh', x: 360, y: 210, region: 'Punjab', neighbors: ['delhi', 'amritsar', 'shimla'], nodeType: 'REGULAR' },
  { id: 'amritsar', name: 'Amritsar', x: 310, y: 180, region: 'Punjab', neighbors: ['chandigarh', 'srinagar'], nodeType: 'REGULAR' },

  // Hill Stations & North
  { id: 'shimla', name: 'Shimla', x: 390, y: 190, region: 'Himachal Pradesh', neighbors: ['chandigarh', 'dehradun'], nodeType: 'REGULAR' },
  { id: 'dehradun', name: 'Dehradun', x: 420, y: 210, region: 'Uttarakhand', neighbors: ['delhi', 'shimla'], nodeType: 'REGULAR' },
  { id: 'srinagar', name: 'Srinagar', x: 310, y: 100, region: 'Kashmir', neighbors: ['amritsar'], nodeType: 'REGULAR' },
];

// Helper to get random nodes excluding some
function getRandomNodes(count: number, exclude: string[] = []): string[] {
  const available = INDIA_MAP.filter(n => !exclude.includes(n.id) && n.nodeType !== 'START');
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(n => n.id);
}

// Helper to get a single random node with fallback
function getRandomNode(exclude: string[] = []): string {
  const nodes = getRandomNodes(1, exclude);
  return nodes[0] ?? 'delhi'; // fallback to delhi if somehow no nodes available
}

// Helper to get shop nodes
function getShopNodes(): string[] {
  return INDIA_MAP.filter(n => n.nodeType === 'SHOP').map(n => n.id);
}

export class GameManager {
  private rooms: Map<string, GameRoom> = new Map();

  createRoom(roomId: string): GameRoom {
    if (this.rooms.has(roomId)) {
      return this.rooms.get(roomId)!;
    }

    // Random fairy position (not at start)
    const fairyNodeId = getRandomNode(['kanyakumari']);

    // 4 random treasure nodes
    const treasureNodeIds = getRandomNodes(4, ['kanyakumari', fairyNodeId]);

    // Shop nodes from map definition
    const shopNodeIds = getShopNodes();

    const room: GameRoom = {
      roomId,
      players: [],
      currentTurnIndex: 0,
      fairyNodeId,
      treasureNodeIds,
      foundTreasures: [],
      shopNodeIds,
      status: 'WAITING',
      turnPhase: 'WAITING_FOR_ROLL',
      remainingMoves: 0,
    };

    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  addPlayer(roomId: string, playerName: string): { room: GameRoom; player: PlayerState } | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    if (room.status !== 'WAITING') return null;
    if (room.players.length >= GAME_CONFIG.MAX_PLAYERS) return null;

    // Check for duplicate names
    if (room.players.find(p => p.name === playerName)) return null;

    const playerIndex = room.players.length;
    const player: PlayerState = {
      id: uuidv4(),
      name: playerName,
      color: GAME_CONFIG.PLAYER_COLORS[playerIndex] ?? '#888888',
      currentNodeId: 'kanyakumari',
      coins: GAME_CONFIG.STARTING_COINS,
      stars: 0,
      isTurn: false,
      cards: [],
      isBlocked: false,
      hasAnswerCard: false,
    };

    room.players.push(player);
    return { room, player };
  }

  removePlayer(roomId: string, playerId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const playerIndex = room.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return null;

    room.players.splice(playerIndex, 1);

    // Adjust turn index if needed
    if (room.currentTurnIndex >= room.players.length) {
      room.currentTurnIndex = 0;
    }

    // If room is empty, delete it
    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return null;
    }

    return room;
  }

  startGame(roomId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    if (room.players.length < GAME_CONFIG.MIN_PLAYERS_TO_START) return null;
    if (room.status !== 'WAITING') return null;

    room.status = 'PLAYING';
    room.currentTurnIndex = 0;
    const firstPlayer = room.players[0];
    if (firstPlayer) {
      firstPlayer.isTurn = true;
    }
    room.turnPhase = 'WAITING_FOR_ROLL';

    return room;
  }

  // Roll dice for current player
  rollDice(roomId: string, playerId: string): { room: GameRoom; diceValue: number; validMoves: string[] } | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return null;

    const currentPlayer = room.players[room.currentTurnIndex];
    if (!currentPlayer) return null;
    if (currentPlayer.id !== playerId) return null;
    if (room.turnPhase !== 'WAITING_FOR_ROLL') return null;

    // Check if blocked
    if (currentPlayer.isBlocked) {
      currentPlayer.isBlocked = false;
      this.nextTurn(roomId);
      return null; // Turn skipped
    }

    const diceValue = Math.floor(Math.random() * 6) + 1;
    room.diceValue = diceValue;
    room.remainingMoves = diceValue;
    room.turnPhase = 'MOVING';

    // Calculate ALL reachable nodes within dice value using BFS
    const validMoves = this.getReachableNodes(currentPlayer.currentNodeId, diceValue);

    return { room, diceValue, validMoves };
  }

  // Get all reachable nodes within a given number of steps using BFS
  getReachableNodes(startNodeId: string, maxSteps: number): string[] {
    if (maxSteps <= 0) return [];

    const visited = new Set<string>();
    const reachable = new Set<string>();
    const queue: { nodeId: string; steps: number }[] = [{ nodeId: startNodeId, steps: 0 }];

    visited.add(startNodeId);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.steps >= maxSteps) continue;

      const node = INDIA_MAP.find(n => n.id === current.nodeId);
      if (!node) continue;

      for (const neighborId of node.neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          reachable.add(neighborId); // All neighbors within range are reachable

          if (current.steps + 1 < maxSteps) {
            queue.push({ nodeId: neighborId, steps: current.steps + 1 });
          }
        }
      }
    }

    return Array.from(reachable);
  }

  // Get valid moves from a node (now uses BFS with remaining moves)
  getValidMoves(nodeId: string, maxSteps: number = 1): string[] {
    return this.getReachableNodes(nodeId, maxSteps);
  }

  // Check if move is valid (now checks if target is reachable within remaining moves)
  isValidMove(currentId: string, targetId: string, maxSteps: number = 1): boolean {
    const reachable = this.getReachableNodes(currentId, maxSteps);
    return reachable.includes(targetId);
  }

  // Move player - now supports direct jump to any reachable node
  movePlayer(roomId: string, playerId: string, targetNodeId: string): { room: GameRoom; events: string[] } | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return null;

    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isTurn) return null;
    if (room.turnPhase !== 'MOVING') return null;
    if (room.remainingMoves <= 0) return null;

    // Validate that target is reachable within remaining moves
    if (!this.isValidMove(player.currentNodeId, targetNodeId, room.remainingMoves)) {
      return null;
    }

    // Move directly to destination
    player.currentNodeId = targetNodeId;
    room.remainingMoves = 0; // Movement complete - player chose their destination

    const events: string[] = [];

    // Check for special node interactions
    // Check fairy
    if (targetNodeId === room.fairyNodeId) {
      room.turnPhase = 'FAIRY_INTERACTION';
      events.push('FAIRY');
    }
    // Check shop
    else if (room.shopNodeIds.includes(targetNodeId)) {
      room.turnPhase = 'SHOP';
      events.push('SHOP');
    }
    // Check treasure
    else if (room.treasureNodeIds.includes(targetNodeId) && !room.foundTreasures.includes(targetNodeId)) {
      player.stars += GAME_CONFIG.TREASURE_REWARD_STARS;
      room.foundTreasures.push(targetNodeId);
      room.treasureNodeIds = room.treasureNodeIds.filter(id => id !== targetNodeId);
      events.push('TREASURE');

      // Check win condition
      if (player.stars >= GAME_CONFIG.WIN_STARS) {
        this.endGame(roomId, playerId);
        events.push('WIN');
      } else {
        room.turnPhase = 'QUIZ';
      }
    }
    // Regular node -> quiz
    else {
      room.turnPhase = 'QUIZ';
    }

    return { room, events };
  }

  // Set quiz for current turn
  setQuiz(roomId: string, quiz: Quiz): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.currentQuiz = quiz;
  }

  // Answer quiz
  answerQuiz(roomId: string, playerId: string, answerIndex: number): { correct: boolean; coinsChange: number; room: GameRoom; hasAnswerCard: boolean } | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return null;

    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isTurn) return null;
    if (room.turnPhase !== 'QUIZ' || !room.currentQuiz) return null;

    let correct = answerIndex === room.currentQuiz.correctIndex;
    const hasAnswerCard = player.hasAnswerCard;

    // Answer card auto-corrects
    if (player.hasAnswerCard && !correct) {
      correct = true;
      player.hasAnswerCard = false;
    }

    let coinsChange: number;
    if (correct) {
      coinsChange = GAME_CONFIG.QUIZ_REWARD;
      player.coins += coinsChange;
    } else {
      coinsChange = -GAME_CONFIG.QUIZ_PENALTY;
      player.coins = Math.max(0, player.coins + coinsChange);
    }

    room.currentQuiz = undefined;
    room.turnPhase = 'TURN_ENDED';

    return { correct, coinsChange, room, hasAnswerCard };
  }

  // Fairy interaction
  fairyExchange(roomId: string, playerId: string, starsToExchange: number): { room: GameRoom; starsGained: number; coinsSpent: number } | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return null;

    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isTurn) return null;
    if (room.turnPhase !== 'FAIRY_INTERACTION') return null;

    const coinsNeeded = starsToExchange * GAME_CONFIG.FAIRY_STAR_COST;
    if (player.coins < coinsNeeded) return null;

    player.coins -= coinsNeeded;
    player.stars += starsToExchange;

    // Move fairy to new random location
    room.fairyNodeId = getRandomNode([room.fairyNodeId, 'kanyakumari']);

    // Check win
    if (player.stars >= GAME_CONFIG.WIN_STARS) {
      this.endGame(roomId, playerId);
    } else {
      room.turnPhase = 'QUIZ';
    }

    return { room, starsGained: starsToExchange, coinsSpent: coinsNeeded };
  }

  // Skip fairy interaction
  skipFairy(roomId: string, playerId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return null;

    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isTurn) return null;
    if (room.turnPhase !== 'FAIRY_INTERACTION') return null;

    room.turnPhase = 'QUIZ';
    return room;
  }

  // Shop: Buy card
  buyCard(roomId: string, playerId: string, cardType: CardType): { room: GameRoom; card: Card } | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return null;

    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isTurn) return null;
    if (room.turnPhase !== 'SHOP') return null;

    const cost = CARD_COSTS[cardType];
    if (player.coins < cost) return null;

    player.coins -= cost;
    const card: Card = { id: uuidv4(), type: cardType };
    player.cards.push(card);

    return { room, card };
  }

  // Shop: Buy star
  buyStarFromShop(roomId: string, playerId: string): { room: GameRoom; stars: number } | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return null;

    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isTurn) return null;
    if (room.turnPhase !== 'SHOP') return null;

    if (player.coins < GAME_CONFIG.SHOP_STAR_COST) return null;

    player.coins -= GAME_CONFIG.SHOP_STAR_COST;
    player.stars += 1;

    // Check win
    if (player.stars >= GAME_CONFIG.WIN_STARS) {
      this.endGame(roomId, playerId);
    }

    return { room, stars: 1 };
  }

  // Skip shop
  skipShop(roomId: string, playerId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return null;

    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isTurn) return null;
    if (room.turnPhase !== 'SHOP') return null;

    room.turnPhase = 'QUIZ';
    return room;
  }

  // Use card
  useCard(roomId: string, playerId: string, cardId: string, targetPlayerId?: string): { room: GameRoom; effect: string; card: Card } | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return null;

    const player = room.players.find(p => p.id === playerId);
    if (!player) return null;

    const cardIndex = player.cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return null;

    const card = player.cards[cardIndex];
    if (!card) return null;

    let effect = '';

    switch (card.type) {
      case 'BLOCK':
        if (!targetPlayerId) return null;
        const targetPlayer = room.players.find(p => p.id === targetPlayerId);
        if (!targetPlayer || targetPlayer.id === playerId) return null;
        targetPlayer.isBlocked = true;
        effect = `${targetPlayer.name} will skip their next turn`;
        break;

      case 'TELEPORT':
        const randomNode = getRandomNode([player.currentNodeId]);
        player.currentNodeId = randomNode;
        effect = `Teleported to ${INDIA_MAP.find(n => n.id === randomNode)?.name ?? randomNode}`;
        break;

      case 'ANSWER':
        player.hasAnswerCard = true;
        effect = 'Next quiz answer will be auto-corrected if wrong';
        break;
    }

    // Remove used card
    player.cards.splice(cardIndex, 1);

    return { room, effect, card };
  }

  // End turn and move to next player
  nextTurn(roomId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'PLAYING') return null;
    if (room.players.length === 0) return null;

    const previousPlayer = room.players[room.currentTurnIndex];
    if (previousPlayer) {
      previousPlayer.isTurn = false;
    }

    room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length;

    const nextPlayer = room.players[room.currentTurnIndex];
    if (nextPlayer) {
      nextPlayer.isTurn = true;
    }

    room.turnPhase = 'WAITING_FOR_ROLL';
    room.diceValue = undefined;
    room.remainingMoves = 0;
    room.currentQuiz = undefined;

    return room;
  }

  // End game
  endGame(roomId: string, winnerId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.status = 'FINISHED';
    room.winnerId = winnerId;
    room.turnPhase = 'TURN_ENDED';

    return room;
  }

  // Get node info
  getNode(nodeId: string): GameNode | undefined {
    return INDIA_MAP.find(n => n.id === nodeId);
  }

  // Delete room
  deleteRoom(roomId: string): void {
    this.rooms.delete(roomId);
  }
}

export const gameManager = new GameManager();
