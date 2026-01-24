import { Router, type Request, type Response } from 'express';
import { gameResultSchema } from '../types/game.types.js';
import { prisma } from '../db.js';

const router = Router();

// Save game result
router.post('/result', async (req: Request, res: Response) => {
  try {
    const result = gameResultSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { roomId, winnerId } = result.data;

    // Update Room Status
    await prisma.room.update({
      where: { id: roomId },
      data: { status: 'FINISHED' }
    });

    // Create Result record
    const gameResult = await prisma.gameResult.create({
      data: {
        roomId,
        winnerId
      }
    });

    res.status(201).json({ message: 'Game result saved successfully', result: gameResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save result' });
  }
});

// Get game history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const results = await prisma.gameResult.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

export default router;
