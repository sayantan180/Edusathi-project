import express from 'express';
import { applyTemplate } from '../controllers/templates.controller.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// POST /api/templates/apply
router.post('/apply', authenticateToken, applyTemplate);

export default router;
