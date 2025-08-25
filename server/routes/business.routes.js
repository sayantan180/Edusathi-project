import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { createBusiness, getBusinesses, getBusinessCount } from '../controllers/business.controller.js';

const router = express.Router();

router.get('/', authenticateToken, getBusinesses);
router.get('/count', authenticateToken, getBusinessCount);
router.post('/', authenticateToken, requireRole(['business']), createBusiness);

export default router;
