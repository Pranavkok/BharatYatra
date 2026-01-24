import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { createRoomSchema, joinRoomSchema, roomIdSchema } from '../types/room.types.js';
import { prisma } from '../db.js';
import { gameManager } from '../ws/gameState.js';

const router = Router();

// Create a new room
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = createRoomSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { name } = result.data;

    // Create in DB
    const room = await prisma.room.create({
      data: {
        name,
        status: 'WAITING',
      }
    });

    // Create in Memory Game Manager
    gameManager.createRoom(room.id);

    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    console.error('Create Room Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all waiting rooms
router.get('/', async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { status: 'WAITING' },
      include: { players: true }
    });
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Join a room (HTTP part - for validation before WS)
router.post('/:roomId/join', async (req: Request, res: Response) => {
  try {
    const paramsResult = roomIdSchema.safeParse(req.params);
    const bodyResult = joinRoomSchema.safeParse(req.body);

    if (!paramsResult.success) {
      return res.status(400).json({ errors: paramsResult.error.issues });
    }
    if (!bodyResult.success) {
      return res.status(400).json({ errors: bodyResult.error.issues });
    }

    const { roomId } = paramsResult.data;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { players: true }
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.status !== 'WAITING') {
      return res.status(400).json({ message: 'Room is already playing or finished' });
    }

    res.status(200).json({ message: 'Can join room', roomId });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get room details
router.get('/:roomId', async (req: Request, res: Response) => {
  try {
    const result = roomIdSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { roomId } = result.data;
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { players: true }
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ room });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
