import { RequestHandler, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { getFileUrl } from '../middleware/upload.js';

export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, role } = req.body as { name: string; email: string; password: string; role?: string };
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: (role as any) || 'student' });

    const access_token = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refresh_token = signRefreshToken({ sub: user._id.toString(), role: user.role });

    res.status(201).json({
      user: sanitizeUser(user),
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const access_token = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refresh_token = signRefreshToken({ sub: user._id.toString(), role: user.role });

    res.json({
      user: sanitizeUser(user),
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refresh: RequestHandler = async (req, res) => {
  try {
    const { refresh_token } = req.body as { refresh_token: string };
    if (!refresh_token) return res.status(400).json({ message: 'Missing refresh_token' });

    const payload = verifyRefreshToken(refresh_token);
    const access_token = signAccessToken({ sub: payload.sub, role: payload.role });
    res.json({ access_token });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
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

    const file = (req as any).file as any;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.avatarUrl = getFileUrl(file.filename);
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
