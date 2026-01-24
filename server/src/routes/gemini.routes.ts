import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { generateQuiz, generateRegionInfo } from '../services/gemini.service.js';

const router = Router();

const quizRequestSchema = z.object({
  cityName: z.string().min(1, 'City name is required'),
  region: z.string().min(1, 'Region is required'),
});

const regionInfoSchema = z.object({
  cityName: z.string().min(1, 'City name is required'),
  region: z.string().min(1, 'Region is required'),
});

// Generate a quiz
router.post('/quiz', async (req: Request, res: Response) => {
  try {
    const result = quizRequestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { cityName, region } = result.data;
    const quiz = await generateQuiz(cityName, region);
    res.status(200).json({ quiz });
  } catch (error) {
    console.error('Quiz Gen Error:', error);
    res.status(500).json({ message: 'Failed to generate quiz' });
  }
});

// Get region info
router.post('/region-info', async (req: Request, res: Response) => {
  try {
    const result = regionInfoSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { cityName, region } = result.data;
    const info = await generateRegionInfo(cityName, region);
    res.status(200).json({ info });
  } catch (error) {
    console.error('Region Info Error:', error);
    res.status(500).json({ message: 'Failed to get region info' });
  }
});

export default router;
