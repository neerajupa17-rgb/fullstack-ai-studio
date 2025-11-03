import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  createGenerationHandler,
  getGenerationsHandler,
} from '../controllers/generation.controller';

const router = Router();

// Configure multer for file uploads (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  },
});

router.post('/', authenticateToken, upload.single('imageUpload'), createGenerationHandler);
router.get('/', authenticateToken, getGenerationsHandler);

export default router;

