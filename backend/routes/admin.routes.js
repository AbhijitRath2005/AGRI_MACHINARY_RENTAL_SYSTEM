import express from 'express';
import {
    getDashboardStats,
    manageUsers,
    getAllBookingsAdmin,
    getRevenueReport,
    getUserGrowthStats,
    getUsers
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.put('/users/:userId', manageUsers);
router.get('/bookings', getAllBookingsAdmin);
router.get('/revenue', getRevenueReport);
router.get('/user-growth', getUserGrowthStats);
router.get('/users', getUsers);

export default router;
