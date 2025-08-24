import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { register, login, refresh, getProfile, updateAvatar, verifyOtp } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/profile', authenticateToken, getProfile);
router.put('/avatar', authenticateToken, upload.single('avatar'), updateAvatar);
// OTP verification
router.post('/verify-otp', verifyOtp);

export default router;
