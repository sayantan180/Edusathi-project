import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createStudentOrder, verifyStudentPayment, getMyEnrollments } from '../controllers/student.controller.js';

const router = express.Router();

router.post('/create-order', requireAuth, createStudentOrder);
router.post('/verify', requireAuth, verifyStudentPayment);
router.get('/my-courses', requireAuth, getMyEnrollments);

export default router;
