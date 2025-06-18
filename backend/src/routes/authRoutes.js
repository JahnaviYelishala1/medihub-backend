import express from 'express';
import { register, login, sendPasswordResetOTP, verifyOTP, resetPassword} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendPasswordResetOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);


export default router;
