import { z } from 'zod';
import type { GameRoom, Quiz, PlayerState, Card } from './game.types.js';

// ============================================
// CLIENT -> SERVER MESSAGES
// ============================================

export const joinRoomPayload = z.object({
  roomId: z.string(),
  playerName: z.string().min(1).max(20),
});

export const createRoomPayload = z.object({
  roomName: z.string().min(1).max(30),
  playerName: z.string().min(1).max(20),
});

export const diceRollPayload = z.object({
  roomId: z.string(),
  playerId: z.string(),
});

export const playerMovePayload = z.object({
  roomId: z.string(),
  playerId: z.string(),
  targetNodeId: z.string(),
});

export const answerQuizPayload = z.object({
  roomId: z.string(),
  playerId: z.string(),
  answerIndex: z.number().min(0).max(3),
});

export const buyCardPayload = z.object({
  roomId: z.string(),
  playerId: z.string(),
  cardType: z.enum(['BLOCK', 'TELEPORT', 'ANSWER']),
});

export const useCardPayload = z.object({
  roomId: z.string(),
  playerId: z.string(),
  cardId: z.string(),
  targetPlayerId: z.string().optional(), // For block card
});

export const fairyInteractionPayload = z.object({
  roomId: z.string(),
  playerId: z.string(),
  action: z.enum(['EXCHANGE', 'SKIP']),
  starsToExchange: z.number().optional(), // How many stars to buy
});

export const shopActionPayload = z.object({
  roomId: z.string(),
  playerId: z.string(),
  action: z.enum(['BUY_STAR', 'BUY_CARD', 'SKIP']),
  cardType: z.enum(['BLOCK', 'TELEPORT', 'ANSWER']).optional(),
});

export const endTurnPayload = z.object({
  roomId: z.string(),
  playerId: z.string(),
});

export const learnRegionPayload = z.object({
  roomId: z.string(),
  nodeId: z.string(),
});

export const clientMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('CREATE_ROOM'), payload: createRoomPayload }),
  z.object({ type: z.literal('JOIN_ROOM'), payload: joinRoomPayload }),
  z.object({ type: z.literal('ROLL_DICE'), payload: diceRollPayload }),
  z.object({ type: z.literal('MOVE_PLAYER'), payload: playerMovePayload }),
  z.object({ type: z.literal('ANSWER_QUIZ'), payload: answerQuizPayload }),
  z.object({ type: z.literal('BUY_CARD'), payload: buyCardPayload }),
  z.object({ type: z.literal('USE_CARD'), payload: useCardPayload }),
  z.object({ type: z.literal('FAIRY_INTERACTION'), payload: fairyInteractionPayload }),
  z.object({ type: z.literal('SHOP_ACTION'), payload: shopActionPayload }),
  z.object({ type: z.literal('END_TURN'), payload: endTurnPayload }),
  z.object({ type: z.literal('LEARN_REGION'), payload: learnRegionPayload }),
]);

export type ClientMessage = z.infer<typeof clientMessageSchema>;

// ============================================
// SERVER -> CLIENT MESSAGES
// ============================================

export type ServerMessage =
  | { type: 'ERROR'; message: string }
  | { type: 'ROOM_CREATED'; payload: { roomId: string; playerId: string } }
  | { type: 'ROOM_STATE'; payload: GameRoom }
  | { type: 'PLAYER_JOINED'; payload: { player: PlayerState; players: PlayerState[] } }
  | { type: 'PLAYER_LEFT'; payload: { playerId: string; players: PlayerState[] } }
  | { type: 'GAME_STARTED'; payload: GameRoom }
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
