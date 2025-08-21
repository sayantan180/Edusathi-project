import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, role } = req.body as { name: string; email: string; password: string; role?: string };
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: role || "student" });

    const access_token = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refresh_token = signRefreshToken({ sub: user._id.toString(), role: user.role });

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error("register error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const access_token = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refresh_token = signRefreshToken({ sub: user._id.toString(), role: user.role });

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const refresh: RequestHandler = async (req, res) => {
  try {
    const { refresh_token } = req.body as { refresh_token: string };
    if (!refresh_token) return res.status(400).json({ message: "Missing refresh_token" });

    const payload = verifyRefreshToken(refresh_token);
    const access_token = signAccessToken({ sub: payload.sub, role: payload.role });
    res.json({ access_token });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const me: RequestHandler = async (req, res) => {
  try {
    // req.user is set by middleware; to avoid circular dep keep this handler simple
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
