import { z } from 'zod';

// Card types available in the game
export const CardType = z.enum(['BLOCK', 'TELEPORT', 'ANSWER']);
export type CardType = z.infer<typeof CardType>;

// Card definitions with costs
export const CARD_COSTS: Record<CardType, number> = {
  BLOCK: 500,
  TELEPORT: 3000,
  ANSWER: 1000,
};

// Node types on the map
export const NodeType = z.enum(['REGULAR', 'SHOP', 'START']);
export type NodeType = z.infer<typeof NodeType>;

export const NodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  x: z.number(),
  y: z.number(),
  region: z.string(),
  neighbors: z.array(z.string()),
  nodeType: NodeType.default('REGULAR'),
});

export type GameNode = z.infer<typeof NodeSchema>;

export const CardSchema = z.object({
  id: z.string(),
  type: CardType,
});

export type Card = z.infer<typeof CardSchema>;

export const PlayerStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  currentNodeId: z.string(),
  coins: z.number().default(500),
  stars: z.number().default(0),
  isTurn: z.boolean().default(false),
  cards: z.array(CardSchema).default([]),
  isBlocked: z.boolean().default(false), // For block card effect
  hasAnswerCard: z.boolean().default(false), // For answer card auto-correct
});

export type PlayerState = z.infer<typeof PlayerStateSchema>;

// Turn phase tracking
export const TurnPhase = z.enum([
  'WAITING_FOR_ROLL',
  'MOVING',
  'QUIZ',
  'FAIRY_INTERACTION',
  'SHOP',
  'TURN_ENDED'
]);
export type TurnPhase = z.infer<typeof TurnPhase>;

// Quiz state
export const QuizSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
  nodeId: z.string(),
  playerId: z.string(),
});

export type Quiz = z.infer<typeof QuizSchema>;

export const GameRoomSchema = z.object({
  roomId: z.string(),
  players: z.array(PlayerStateSchema),
  currentTurnIndex: z.number(),
  fairyNodeId: z.string(),
  treasureNodeIds: z.array(z.string()),
  foundTreasures: z.array(z.string()).default([]), // Track who found which treasure
  shopNodeIds: z.array(z.string()),
  status: z.enum(['WAITING', 'PLAYING', 'FINISHED']),
  winnerId: z.string().optional(),

  // Turn state
  turnPhase: TurnPhase.default('WAITING_FOR_ROLL'),
  diceValue: z.number().optional(),
  remainingMoves: z.number().default(0),
  currentQuiz: QuizSchema.optional(),
});

export type GameRoom = z.infer<typeof GameRoomSchema>;

export const gameResultSchema = z.object({
  roomId: z.string().uuid(),
  winnerId: z.string().uuid(),
});

// Game constants
export const GAME_CONFIG = {
  STARTING_COINS: 500,
  QUIZ_REWARD: 250,
  QUIZ_PENALTY: 100,
  FAIRY_STAR_COST: 1000, // Coins needed to buy 1 star from fairy
  SHOP_STAR_COST: 5000, // Buy star directly from shop
  TREASURE_REWARD_STARS: 1, // Stars for finding treasure
  WIN_STARS: 10, // Stars needed to win
  MAX_PLAYERS: 4,
  MIN_PLAYERS_TO_START: 2,
  PLAYER_COLORS: ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'], // red, blue, green, amber
};
