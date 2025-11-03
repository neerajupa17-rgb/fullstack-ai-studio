import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { createGeneration, getRecentGenerations } from '../services/generation.service';
import { createGenerationSchema, getGenerationsSchema } from '../validators/generation.validator';

export async function createGenerationHandler(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validated = createGenerationSchema.parse({
      prompt: req.body.prompt,
      style: req.body.style,
    });

    const generation = await createGeneration(req.userId, {
      ...validated,
      imageUpload: req.file,
    });

    res.status(201).json({
      id: generation.id,
      imageUrl: generation.imageUrl,
      prompt: generation.prompt,
      style: generation.style,
      createdAt: generation.createdAt,
      status: generation.status,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error.message === 'Model overloaded') {
      return res.status(503).json({ message: 'Model overloaded' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getGenerationsHandler(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { limit } = getGenerationsSchema.parse(req.query);

    const generations = await getRecentGenerations(req.userId, limit);

    res.json(
      generations.map((gen) => ({
        id: gen.id,
        imageUrl: gen.imageUrl,
        prompt: gen.prompt,
        style: gen.style,
        createdAt: gen.createdAt,
        status: gen.status,
        originalImageUrl: gen.originalImageUrl,
      }))
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

