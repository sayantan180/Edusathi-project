import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export type UserRole = 'creator' | 'business' | 'student' | 'admin';

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

const ACCESS_SECRET: string = (() => {
  const v = process.env.JWT_ACCESS_SECRET;
  if (!v) {
    console.error('JWT_ACCESS_SECRET is not defined in the environment variables');
    process.exit(1);
  }
  return v;
})();

export const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
      if (err || !decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      const payload = decoded as JwtPayload;
      (req as any).user = { _id: payload.id, email: payload.email, role: payload.role, name: payload.name };
      next();
    });
  } catch (error) {
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
