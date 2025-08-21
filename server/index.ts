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
import { register, login, refresh } from "./routes/auth.js";
import { listContents } from "./routes/contents.js";
import { requireAuth } from "./middleware/auth.js";
import { createStudentOrder, verifyStudentPayment, getMyEnrollments } from "./routes/student.js";

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

  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/refresh", refresh);

  // Catalog
  app.get("/api/contents", listContents);

  // Student checkout and enrollments
  app.post("/api/student/create-order", requireAuth, createStudentOrder);
  app.post("/api/student/verify", requireAuth, verifyStudentPayment);
  app.get("/api/student/my-courses", requireAuth, getMyEnrollments);

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
