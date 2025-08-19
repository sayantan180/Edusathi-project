import { RequestHandler } from "express";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export interface CreateOrderRequest {
  amount: number;
  currency: string;
  institute: string;
  owner: string;
  email: string;
  plan: string;
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
    const { amount, currency, institute, owner, email, plan }: CreateOrderRequest = req.body;

    // Validate required fields
    if (!amount || !institute || !owner || !email || !plan) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Create unique receipt ID
    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency || 'USD',
      receipt: receipt,
      notes: {
        institute: institute,
        owner: owner,
        email: email,
        plan: plan,
        timestamp: new Date().toISOString()
      }
    });

    const response: CreateOrderResponse = {
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    };

    res.json(response);
  } catch (error: any) {
    console.error('Payment order creation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment order'
    });
  }
};

export const verifyPayment: RequestHandler = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (razorpay_signature === expectedSignature) {
      // Payment is verified
      // Here you would typically:
      // 1. Create the institute account
      // 2. Send welcome email
      // 3. Set up the domain
      // 4. Activate the plan
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error: any) {
    console.error('Payment verification failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment verification failed'
    });
  }
};

export const getPaymentConfig: RequestHandler = (req, res) => {
  res.json({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
  });
};
