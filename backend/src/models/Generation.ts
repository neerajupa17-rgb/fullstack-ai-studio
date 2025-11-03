export interface Generation {
  id: number;
  userId: number;
  prompt: string;
  style: string;
  imageUrl: string;
  originalImageUrl?: string;
  status: 'completed' | 'failed';
  createdAt: string;
}

export interface CreateGenerationInput {
  prompt: string;
  style: string;
  imageUpload?: Express.Multer.File;
}

