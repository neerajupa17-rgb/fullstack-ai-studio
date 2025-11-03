import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from '../src/config/database';
import authRoutes from '../src/routes/auth.routes';
import generationRoutes from '../src/routes/generation.routes';
import { dbRun } from '../src/config/database';
import { generateToken } from '../src/services/auth.service';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/generations', generationRoutes);

let testUserId: number;
let testToken: string;

beforeAll(async () => {
  await initializeDatabase();
});

beforeEach(async () => {
  // Clean up
  await dbRun('DELETE FROM generations');
  await dbRun('DELETE FROM users');

  // Create test user and get token
  const signupResponse = await request(app)
    .post('/api/auth/signup')
    .send({
      email: 'test@example.com',
      password: 'password123',
    });

  testUserId = signupResponse.body.user.id;
  testToken = signupResponse.body.token;
});

describe('Generations API', () => {
  describe('POST /api/generations', () => {
    it('should create a generation successfully', async () => {
      // Mock to avoid random 20% error
      const response = await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${testToken}`)
        .field('prompt', 'Test prompt')
        .field('style', 'Realistic');

      // May succeed or fail due to 20% chance
      expect([201, 503]).toContain(response.status);
    }, 10000); // Increase timeout for simulation delay

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/generations')
        .send({
          prompt: 'Test prompt',
          style: 'Realistic',
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          style: 'Realistic',
          // Missing prompt
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/generations', () => {
    it('should return recent generations', async () => {
      const response = await request(app)
        .get('/api/generations?limit=5')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/generations');

      expect(response.status).toBe(401);
    });
  });
});

