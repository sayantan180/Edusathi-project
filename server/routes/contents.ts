import { RequestHandler } from "express";
import Content from "../models/Content.js";

export const listContents: RequestHandler = async (_req, res) => {
  try {
    const items = await Content.find().sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    console.error("listContents error", err);
    res.status(500).json({ message: "Server error" });
  }
};
