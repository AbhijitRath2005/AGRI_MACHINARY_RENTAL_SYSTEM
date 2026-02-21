import User from '../models/User.js';
import Machine from '../models/Machine.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Maintenance from '../models/Maintenance.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMachines = await Machine.countDocuments({ isActive: true });
        const totalBookings = await Booking.countDocuments();
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const pendingMaintenance = await Maintenance.countDocuments({
            status: { $in: ['scheduled', 'in-progress', 'completed'] }
        });

        const recentBookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('machineId', 'name type')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalMachines,
                    totalBookings,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    pendingMaintenance
                },
                recentBookings
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Manage users
export const manageUsers = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all bookings with details
export const getAllBookingsAdmin = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email phone')
            .populate('machineId', 'name type pricePerDay')
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

// Get revenue report
export const getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let matchQuery = { status: 'completed' };
        if (startDate && endDate) {
            matchQuery.paymentDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const revenueByMonth = await Payment.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: {
                        year: { $year: '$paymentDate' },
                        month: { $month: '$paymentDate' }
                    },
                    totalRevenue: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]);

        res.json({
            success: true,
            data: revenueByMonth
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get users by role (for admin database viewer)
export const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user growth stats
export const getUserGrowthStats = async (req, res) => {
    try {
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.json({
            success: true,
            data: userGrowth
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
