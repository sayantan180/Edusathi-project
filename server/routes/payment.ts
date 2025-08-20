import { RequestHandler } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Center from "../models/Center.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

export interface CreateOrderRequest {
  amount: number;
  currency: string;
  institute: string;
  owner: string;
  email: string;
  plan: string;
  domain: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  error?: string;
}

export const createPaymentOrder: RequestHandler = async (req, res) => {
  try {
    const {
      amount,
      currency,
      institute,
      owner,
      email,
      plan,
      domain,
    }: CreateOrderRequest = req.body;

    // Validate required fields
    if (!amount || !institute || !owner || !email || !plan || !domain) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Create unique receipt ID
    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: "INR",
      receipt: receipt,
      notes: {
        institute: institute,
        owner: owner,
        email: email,
        plan: plan,
        domain: domain,
        timestamp: new Date().toISOString(),
      },
    });

    const response: CreateOrderResponse = {
      success: true,
      order: {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        receipt: order.receipt || "",
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error(
      "Payment order creation failed:",
      error.statusCode, 
      error.error
    );
    res.status(500).json({
      success: false,
      error: error.error?.description || "Failed to create payment order",
    });
  }
};

export const verifyPayment: RequestHandler = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Verify payment signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "dummy_secret")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (razorpay_signature === expectedSignature) {
      // Payment is verified
      // Here you would typically:
      // Payment is verified, now create the center
      const orderDetails = await razorpay.orders.fetch(razorpay_order_id);

      if (!orderDetails) {
        throw new Error("Order not found");
      }

      const notes = orderDetails.notes || {};
      const institute = notes.institute as string;
      const owner = notes.owner as string;
      const email = notes.email as string;
      const plan = notes.plan as string;
      const domain = notes.domain as string;

      if (!institute || !owner || !email || !plan || !domain) {
        throw new Error("Missing required fields in order notes");
      }

      // Check if a center with this domain or email already exists
      const existingCenter = await Center.findOne({ $or: [{ domain }, { email }] });
      if (existingCenter) {
        return res.status(409).json({
          success: false,
          error: "A center with this domain or email already exists.",
        });
      }

      // Create the new center in the database
      const expiresAt = new Date();
      // Calculate expiry based on plan duration
      if (plan && plan.toLowerCase().includes('1 year')) {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else if (plan && plan.toLowerCase().includes('3 year')) {
        expiresAt.setFullYear(expiresAt.getFullYear() + 3);
      } else if (plan && plan.toLowerCase().includes('5 year')) {
        expiresAt.setFullYear(expiresAt.getFullYear() + 5);
      } else {
        // Default to 1 year if plan format is unclear
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      const newCenter = new Center({
        instituteName: institute,
        ownerName: owner,
        email,
        domain,
        plan,
        razorpay_order_id,
        razorpay_payment_id,
        expiresAt,
      });

      await newCenter.save();

      res.json({
        success: true,
        message: "Payment verified and institute created successfully",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        center: newCenter,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Payment verification failed",
      });
    }
  } catch (error: any) {
    console.error("Payment verification failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Payment verification failed",
    });
  }
};

export const getPaymentConfig: RequestHandler = (req, res) => {
  res.json({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy_key",
  });
};
