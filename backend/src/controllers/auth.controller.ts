import { Request, Response } from 'express';
import { createUser, findUserByEmail, comparePassword, generateToken } from '../services/auth.service';
import { signupSchema, loginSchema } from '../validators/auth.validator';

export async function signup(req: Request, res: Response) {
  try {
    const validated = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await findUserByEmail(validated.email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = await createUser(validated.email, validated.password);
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await findUserByEmail(validated.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(validated.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

