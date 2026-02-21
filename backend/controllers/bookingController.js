import Booking from '../models/Booking.js';
import Machine from '../models/Machine.js';
import { checkBookingConflict } from '../utils/dateValidator.js';

// Create new booking
export const createBooking = async (req, res) => {
    try {
        const { machineId, startDate, endDate, notes } = req.body;

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        // Check if machine exists and is available
        const machine = await Machine.findById(machineId);
        if (!machine) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            });
        }

        if (machine.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Machine is not available for booking'
            });
        }

        // Check for booking conflicts
        const hasConflict = await checkBookingConflict(machineId, start, end);
        if (hasConflict) {
            return res.status(400).json({
                success: false,
                message: 'Machine is already booked for the selected dates'
            });
        }

        // Calculate total days and amount
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalAmount = totalDays * machine.pricePerDay;

        // Create booking
        const booking = new Booking({
            userId: req.user._id,
            machineId,
            startDate: start,
            endDate: end,
            totalDays,
            totalAmount,
            notes
        });

        await booking.save();

        // Populate booking details
        await booking.populate('machineId userId');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all bookings (with filters)
export const getAllBookings = async (req, res) => {
    try {
        const { status, userId, machineId } = req.query;

        let query = {};

        if (status) query.status = status;
        if (userId) query.userId = userId;
        if (machineId) query.machineId = machineId;

        const bookings = await Booking.find(query)
            .populate('userId', 'name email phone')
            .populate('machineId', 'name type pricePerDay imageUrl')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('machineId', 'name type pricePerDay imageUrl')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single booking
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId', 'name email phone address')
            .populate('machineId');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.status = status;
        await booking.save();

        // Update machine status based on booking status
        const machine = await Machine.findById(booking.machineId);
        if (status === 'confirmed') {
            machine.status = 'rented';
        } else if (status === 'completed' || status === 'cancelled') {
            machine.status = 'available';
        }
        await machine.save();

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Only user who made booking can cancel
        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        // Update machine status
        const machine = await Machine.findById(booking.machineId);
        machine.status = 'available';
        await machine.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
