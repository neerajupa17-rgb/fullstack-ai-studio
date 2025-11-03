import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbRun, dbGet } from '../config/database';
import { User, UserWithoutPassword } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function createUser(
  email: string,
  password: string
): Promise<UserWithoutPassword> {
  const hashedPassword = await hashPassword(password);
  const result = await dbRun(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword]
  );
  return {
    id: (result as any).lastID,
    email,
    createdAt: new Date().toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
  return user as User | null;
}

export function verifyToken(token: string): { userId: number; email: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch (error) {
    throw new Error('Invalid token');
  }
}

