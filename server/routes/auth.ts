import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User, { IUser } from '../models/User.js';
import { getFileUrl } from '../middleware/upload.js';

const ACCESS_SECRET: string = (() => {
  const v = process.env.JWT_ACCESS_SECRET;
  if (!v) {
    console.error('JWT_ACCESS_SECRET is not defined in the environment variables');
    process.exit(1);
  }
  return v;
})();

const REFRESH_SECRET: string = (() => {
  const v = process.env.JWT_REFRESH_SECRET;
  if (!v) {
    console.error('JWT_REFRESH_SECRET is not defined in the environment variables');
    process.exit(1);
  }
  return v;
})();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['creator', 'business', 'student', 'admin']).optional().default('creator')
});

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = registerSchema.parse(req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed, role });
    await user.save();

    const tokens = signTokens(user);

    res.status(201).json({
      user: sanitizeUser(user),
      ...tokens,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const tokens = signTokens(user);

    res.json({
      user: sanitizeUser(user),
      ...tokens,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id as string | undefined;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('name email role avatarUrl');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id as string | undefined;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.avatarUrl = getFileUrl(req.file.filename);
    await user.save();

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

function sanitizeUser(user: Pick<IUser, '_id' | 'name' | 'email' | 'role'> & { avatarUrl?: string }) {
  return { id: String((user as any)._id), name: user.name, email: user.email, role: user.role, avatarUrl: (user as any).avatarUrl || '' };
}

function signTokens(user: IUser) {
  const payload = { id: String(user._id), email: user.email, role: user.role, name: user.name };
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: String(user._id) }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}
