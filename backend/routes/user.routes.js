import express from 'express';
import { getUserProfile, updateUserProfile, getAllUsers } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', getUserProfile);
router.put('/:id', updateUserProfile);

export default router;
