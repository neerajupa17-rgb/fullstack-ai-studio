import { dbRun, dbGet, dbAll } from '../config/database';
import { Generation, CreateGenerationInput } from '../models/Generation';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const GENERATED_IMAGES_DIR = path.join(__dirname, '../../public/generated');

// Ensure directories exist
[UPLOAD_DIR, GENERATED_IMAGES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function simulateModelOverload(): boolean {
  // 20% chance of overload
  return Math.random() < 0.2;
}

function generateImageUrl(): string {
  // Simulate generating an image URL
  // In a real app, this would be the result from the AI model
  // For demo purposes, we use a placeholder service
  const timestamp = Date.now();
  // Using placeholder image service for demo
  return `https://picsum.photos/512/512?random=${timestamp}`;
}

export async function createGeneration(
  userId: number,
  input: CreateGenerationInput
): Promise<Generation> {
  // Simulate 1-2 second delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

  // 20% chance of model overload error
  if (simulateModelOverload()) {
    throw new Error('Model overloaded');
  }

  // Save uploaded image if provided
  let originalImageUrl: string | undefined;
  if (input.imageUpload) {
    const ext = path.extname(input.imageUpload.originalname);
    const filename = `original-${userId}-${Date.now()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(filepath, input.imageUpload.buffer);
    originalImageUrl = `/uploads/${filename}`;
  }

  // Generate simulated result
  const imageUrl = generateImageUrl();

  const result = await dbRun(
    `INSERT INTO generations (userId, prompt, style, imageUrl, originalImageUrl, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, input.prompt, input.style, imageUrl, originalImageUrl || null, 'completed']
  );

  return {
    id: (result as any).lastID,
    userId,
    prompt: input.prompt,
    style: input.style,
    imageUrl,
    originalImageUrl,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };
}

export async function getRecentGenerations(
  userId: number,
  limit: number = 5
): Promise<Generation[]> {
  const generations = await dbAll(
    `SELECT * FROM generations 
     WHERE userId = ? 
     ORDER BY createdAt DESC 
     LIMIT ?`,
    [userId, limit]
  );
  return generations as Generation[];
}

export async function getGenerationById(
  id: number,
  userId: number
): Promise<Generation | null> {
  const generation = await dbGet(
    'SELECT * FROM generations WHERE id = ? AND userId = ?',
    [id, userId]
  );
  return generation as Generation | null;
}

