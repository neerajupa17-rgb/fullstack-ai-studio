import { z } from 'zod';

export const createGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(500, 'Prompt too long'),
  style: z.string().min(1, 'Style is required'),
});

export const getGenerationsSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 5))
    .pipe(z.number().min(1).max(10)),
});

