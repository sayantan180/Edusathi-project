import "dotenv/config";
import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo.js";
import {
  getCenters,
  createCenter,
  getCenterById,
  deleteCenter,
} from "./routes/centers.js";
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentConfig,
} from "./routes/payment.js";
import { register, login, getProfile, updateAvatar } from "./routes/auth.js";
import { 
  createContent, 
  getMyContents, 
  updateContent, 
  deleteContent, 
  assignToBusiness,
  getBusinesses,
  getContentById
} from "./routes/content.js";
import { getMySales, getContentSales } from "./routes/sales.js";
import { createBusiness } from "./routes/business.js";
import { authenticateToken, requireRole } from "./middleware/auth.js";
import { upload } from "./middleware/upload.js";

export function createServer() {
  const app = express();
  const port = process.env.PORT || 3001;

  // Connect to MongoDB
  connectDB();

  app.use(cors());
  // Handle CORS preflight requests globally (Express 5 + path-to-regexp v6)
  app.options(/.*/, cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Temporary request logger (debug 404s)
  app.use((req, _res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/profile", authenticateToken, getProfile);
  app.put("/api/auth/avatar", authenticateToken, upload.single('avatar'), updateAvatar);

  // Content routes (Creator only)
  app.post(
    "/api/content",
    authenticateToken,
    requireRole(['creator']),
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
    createContent
  );
  app.get("/api/content/my", authenticateToken, requireRole(['creator']), getMyContents);
  app.get("/api/content/:id", authenticateToken, requireRole(['creator']), getContentById);
  app.put("/api/content/:id", authenticateToken, requireRole(['creator']), updateContent);
  app.delete("/api/content/:id", authenticateToken, requireRole(['creator']), deleteContent);
  app.put("/api/content/:id/assign", authenticateToken, requireRole(['creator']), assignToBusiness);

  // Business routes
  app.get("/api/businesses", authenticateToken, getBusinesses);
  app.post("/api/businesses", authenticateToken, requireRole(['creator', 'business']), createBusiness);

  // Sales routes (Creator only)
  app.get("/api/sales/my", authenticateToken, requireRole(['creator']), getMySales);
  app.get("/api/sales/content/:contentId", authenticateToken, requireRole(['creator']), getContentSales);

  // Centers API routes
  app.get("/api/centers", getCenters);
  app.post("/api/centers", createCenter);
  app.get("/api/centers/:id", getCenterById);
  app.delete("/api/centers/:id", deleteCenter);

  // Payment API routes
  app.post("/api/payment/create-order", createPaymentOrder);
  app.post("/api/payment/verify", verifyPayment);
  app.get("/api/payment/config", getPaymentConfig);
  
  // Global error handler (handle multer and other runtime errors)
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[ERR]', err);
    // Multer errors or our fileFilter error message
    if (err?.name === 'MulterError' || (typeof err?.message === 'string' && err.message.toLowerCase().includes('invalid file type'))) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  });

  // 404 handler (debugging)
  app.use((req, res) => {
    console.warn(`[404] ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Not Found', path: req.url, method: req.method });
  });

  return app;
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = createServer();
  const port = process.env.PORT || 3001;
  
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}
