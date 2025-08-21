import type { UserRole } from '../middleware/auth';

declare global {
  namespace Express {
    interface UserPayload {
      _id?: string;
      sub?: string;
      email?: string;
      role: UserRole;
      name?: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
