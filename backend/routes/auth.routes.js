import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadVehicleProof } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.post('/register', uploadVehicleProof.single('vehicleProof'), register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;
