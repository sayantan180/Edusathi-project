import "dotenv/config";
import express from "express";
import connectDB from "./db.js";
import cors from "cors";
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

export function createServer() {
  const app = express();
  const port = process.env.PORT || 3001;

  // Connect to MongoDB
  connectDB();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Centers API routes
  app.get("/api/centers", getCenters);
  app.post("/api/centers", createCenter);
  app.get("/api/centers/:id", getCenterById);
  app.delete("/api/centers/:id", deleteCenter);

  // Payment API routes
  app.post("/api/payment/create-order", createPaymentOrder);
  app.post("/api/payment/verify", verifyPayment);
  app.get("/api/payment/config", getPaymentConfig);

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
