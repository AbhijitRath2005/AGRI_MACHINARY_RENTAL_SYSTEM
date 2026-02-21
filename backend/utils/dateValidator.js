import Booking from '../models/Booking.js';

// Check if there's a booking conflict for a machine
export const checkBookingConflict = async (machineId, startDate, endDate, excludeBookingId = null) => {
    try {
        const query = {
            machineId,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                // New booking starts during existing booking
                {
                    startDate: { $lte: startDate },
                    endDate: { $gte: startDate }
                },
                // New booking ends during existing booking
                {
                    startDate: { $lte: endDate },
                    endDate: { $gte: endDate }
                },
                // New booking completely contains existing booking
                {
                    startDate: { $gte: startDate },
                    endDate: { $lte: endDate }
                }
            ]
        };

        // Exclude specific booking (for updates)
        if (excludeBookingId) {
            query._id = { $ne: excludeBookingId };
        }

        const conflictingBooking = await Booking.findOne(query);
        return !!conflictingBooking;
    } catch (error) {
        throw new Error('Error checking booking conflict: ' + error.message);
    }
};

// Validate date range
export const validateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
        return { valid: false, message: 'Start date cannot be in the past' };
    }

    if (end <= start) {
        return { valid: false, message: 'End date must be after start date' };
    }

    return { valid: true };
};
