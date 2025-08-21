import jwt from "jsonwebtoken";

export interface JWTPayload {
  sub: string; // user id
  role: string;
}

import type { Secret, SignOptions } from "jsonwebtoken";

const ACCESS_SECRET: Secret = (process.env.JWT_ACCESS_SECRET || "dev_access_secret") as Secret;
const REFRESH_SECRET: Secret = (process.env.JWT_REFRESH_SECRET || "dev_refresh_secret") as Secret;
const ACCESS_EXPIRES: SignOptions["expiresIn"] = (process.env.JWT_ACCESS_EXPIRES || "15m") as any;
const REFRESH_EXPIRES: SignOptions["expiresIn"] = (process.env.JWT_REFRESH_EXPIRES || "7d") as any;

export function signAccessToken(payload: JWTPayload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(payload: JWTPayload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
}
