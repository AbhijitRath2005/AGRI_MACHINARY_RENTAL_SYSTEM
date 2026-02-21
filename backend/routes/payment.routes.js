import express from 'express';
import {
    createPaymentIntent,
    confirmPayment,
    getPaymentById,
    getUserPayments,
    getAllPayments
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/my-payments', getUserPayments);
router.get('/:id', getPaymentById);
router.get('/', authorize('admin'), getAllPayments);

export default router;
