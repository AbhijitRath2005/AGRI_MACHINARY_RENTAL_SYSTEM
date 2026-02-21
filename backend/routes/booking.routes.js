import express from 'express';
import {
    createBooking,
    getAllBookings,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createBooking);
router.get('/', authorize('admin', 'owner'), getAllBookings);
router.get('/my-bookings', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', authorize('admin', 'owner'), updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

export default router;
