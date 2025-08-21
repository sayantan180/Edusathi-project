import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyAccessToken, JWTPayload } from '../utils/jwt.js';

export type UserRole = 'creator' | 'business' | 'student' | 'admin';

// For student routes expecting { sub, role }
export type AuthRequest = Request & { user?: JWTPayload };

// Minimal auth that exposes the raw JWT payload (with sub and role)
export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.substring(7) : '';
    if (!token) return res.status(401).json({ message: 'Missing token' });
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Auth that maps payload.sub -> req.user._id for creator/business flows
export const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'] as string | undefined;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const payload = verifyAccessToken(token); // { sub, role }
    (req as any).user = { _id: payload.sub, role: payload.role };
    next();
  } catch (_error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (roles: UserRole[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { role?: UserRole } | undefined;
    if (!user || !user.role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
