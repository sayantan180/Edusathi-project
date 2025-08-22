import express from 'express';
import { getCenters, createCenter, getCenterById, deleteCenter } from '../controllers/centers.controller.js';

const router = express.Router();

// GET /api/centers
router.get('/', getCenters);
// POST /api/centers
router.post('/', createCenter);
// GET /api/centers/:id
router.get('/:id', getCenterById);
// DELETE /api/centers/:id
router.delete('/:id', deleteCenter);

export default router;
