// Card types
export type CardType = 'BLOCK' | 'TELEPORT' | 'ANSWER';

export interface Card {
  id: string;
  type: CardType;
}

// Node types
export type NodeType = 'REGULAR' | 'SHOP' | 'START';

export interface GameNode {
  id: string;
  name: string;
  x: number;
  y: number;
  region: string;
  neighbors: string[];
  nodeType: NodeType;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  currentNodeId: string;
  coins: number;
  stars: number;
  isTurn: boolean;
  cards: Card[];
  isBlocked: boolean;
  hasAnswerCard: boolean;
}

export type TurnPhase =
  | 'WAITING_FOR_ROLL'
  | 'MOVING'
  | 'QUIZ'
  | 'FAIRY_INTERACTION'
  | 'SHOP'
  | 'TURN_ENDED';

export type GameStatus = 'WAITING' | 'PLAYING' | 'FINISHED';

export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  nodeId: string;
  playerId: string;
}

export interface GameState {
  roomId: string;
  players: Player[];
  currentTurnIndex: number;
  fairyNodeId: string;
  treasureNodeIds: string[];
  foundTreasures: string[];
  shopNodeIds: string[];
  status: GameStatus;
  winnerId?: string;
  turnPhase: TurnPhase;
  diceValue?: number;
  remainingMoves: number;
  currentQuiz?: Quiz;
}

// Server message types
export type ServerMessage =
  | { type: 'ERROR'; message: string }
  | { type: 'ROOM_CREATED'; payload: { roomId: string; playerId: string } }
  | { type: 'ROOM_STATE'; payload: GameState }
  | { type: 'PLAYER_JOINED'; payload: { player: Player; players: Player[] } }
  | { type: 'PLAYER_LEFT'; payload: { playerId: string; players: Player[] } }
  | { type: 'GAME_STARTED'; payload: GameState }
  | { type: 'DICE_ROLLED'; payload: { playerId: string; value: number; validMoves: string[] } }
  | { type: 'PLAYER_MOVED'; payload: { playerId: string; nodeId: string; remainingMoves: number } }
  | { type: 'QUIZ_GENERATED'; payload: Quiz }
  | { type: 'QUIZ_ANSWERED'; payload: { playerId: string; correct: boolean; coinsChange: number; newCoins: number; hasAnswerCard?: boolean } }
  | { type: 'FAIRY_REACHED'; payload: { playerId: string; fairyNodeId: string } }
  | { type: 'FAIRY_EXCHANGED'; payload: { playerId: string; starsGained: number; coinsSpent: number; newFairyNodeId: string } }
  | { type: 'SHOP_REACHED'; payload: { playerId: string; shopNodeId: string } }
  | { type: 'CARD_PURCHASED'; payload: { playerId: string; card: Card; coinsSpent: number } }
  | { type: 'STAR_PURCHASED'; payload: { playerId: string; stars: number; coinsSpent: number } }
  | { type: 'CARD_USED'; payload: { playerId: string; card: Card; targetPlayerId?: string; effect: string } }
  | { type: 'PLAYER_BLOCKED'; payload: { playerId: string; blockedByPlayerId: string } }
  | { type: 'PLAYER_TELEPORTED'; payload: { playerId: string; newNodeId: string } }
  | { type: 'TREASURE_FOUND'; payload: { playerId: string; nodeId: string; starsGained: number } }
  | { type: 'TURN_CHANGED'; payload: { currentPlayerId: string; currentTurnIndex: number; previousPlayerId?: string } }
  | { type: 'REGION_INFO'; payload: { nodeId: string; nodeName: string; info: string } }
  | { type: 'GAME_OVER'; payload: { winnerId: string; winnerName: string; finalScores: { playerId: string; name: string; stars: number; coins: number }[] } };

// Game config
export const GAME_CONFIG = {
  STARTING_COINS: 500,
  QUIZ_REWARD: 250,
  QUIZ_PENALTY: 100,
  FAIRY_STAR_COST: 1000,
  SHOP_STAR_COST: 5000,
  WIN_STARS: 10,
  MAX_PLAYERS: 4,
  CARD_COSTS: {
    BLOCK: 500,
    TELEPORT: 3000,
    ANSWER: 1000,
  } as Record<CardType, number>,
};
