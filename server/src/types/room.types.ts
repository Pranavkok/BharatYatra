import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(30),
  playerName: z.string().min(1, 'Player name is required').max(20).optional(),
});

export const joinRoomSchema = z.object({
  playerName: z.string().min(1, 'Player name is required').max(20),
});

export const roomIdSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
});
