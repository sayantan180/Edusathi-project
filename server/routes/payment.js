import Razorpay from 'razorpay';
import crypto from 'crypto';
import Center from '../models/Center.js';

function getKeys() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return { key_id, key_secret };
}

function getRazorpay() {
  const keys = getKeys();
  if (!keys) return null;
  return new Razorpay(keys);
}

export const createPaymentOrder = async (req, res) => {
  try {
    const rp = getRazorpay();
    if (!rp) {
      return res.status(500).json({ success: false, error: 'Payment gateway keys not configured' });
    }
    const { amount, institute, owner, email, plan, domain } = req.body || {};

    if (!amount || !institute || !owner || !email || !plan || !domain) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const order = await rp.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: receipt,
      notes: { institute, owner, email, plan, domain, timestamp: new Date().toISOString() },
    });

    res.json({ success: true, order: { id: order.id, amount: Number(order.amount), currency: order.currency, receipt: order.receipt || '' } });
  } catch (error) {
    console.error('Payment order creation failed:', error?.statusCode, error?.error || error);
    res.status(500).json({ success: false, error: error?.error?.description || error?.message || 'Failed to create payment order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const keys = getKeys();
    const rp = getRazorpay();
    if (!keys || !rp) {
      return res.status(500).json({ success: false, error: 'Payment gateway keys not configured' });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    const expectedSignature = crypto
      .createHmac('sha256', keys.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (razorpay_signature === expectedSignature) {
      const orderDetails = await rp.orders.fetch(razorpay_order_id);
      if (!orderDetails) throw new Error('Order not found');

      const notes = orderDetails.notes || {};
      const institute = notes.institute;
      const owner = notes.owner;
      const email = notes.email;
      const plan = notes.plan;
      const domain = notes.domain;

      if (!institute || !owner || !email || !plan || !domain) {
        throw new Error('Missing required fields in order notes');
      }

      const existingCenter = await Center.findOne({ $or: [{ domain }, { email }] });
      if (existingCenter) {
        return res.status(409).json({ success: false, error: 'A center with this domain or email already exists.' });
      }

      const expiresAt = new Date();
      if (plan && plan.toLowerCase().includes('1 year')) {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else if (plan && plan.toLowerCase().includes('3 year')) {
        expiresAt.setFullYear(expiresAt.getFullYear() + 3);
      } else if (plan && plan.toLowerCase().includes('5 year')) {
        expiresAt.setFullYear(expiresAt.getFullYear() + 5);
      } else {
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

      res.json({ success: true, message: 'Payment verified and institute created successfully', payment_id: razorpay_payment_id, order_id: razorpay_order_id, center: newCenter });
    } else {
      res.status(400).json({ success: false, error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ success: false, error: error.message || 'Payment verification failed' });
  }
};

export const getPaymentConfig = (_req, res) => {
  res.json({ key_id: process.env.RAZORPAY_KEY_ID || null, configured: Boolean(process.env.RAZORPAY_KEY_ID) });
};
