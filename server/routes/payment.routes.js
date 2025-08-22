import express from 'express';
import { createPaymentOrder, verifyPayment, getPaymentConfig } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/config', getPaymentConfig);

export default router;
