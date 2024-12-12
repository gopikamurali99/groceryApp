import express from 'express';
import { SignUp,verifyOtp,sendOtp} from './controllers/CustomerRoutes.js';
const router = express.Router();

router.post('/customer/signup',SignUp)
router.post('/customer/send-otp',sendOtp)
router.post('/customer/verify',verifyOtp)

export default router