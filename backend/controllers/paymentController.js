import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { sendPaymentConfirmation } from '../utils/emailService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
export const createPaymentIntent = async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user owns this booking
        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(booking.totalAmount * 100), // Convert to cents
            currency: 'inr',
            metadata: {
                bookingId: booking._id.toString(),
                userId: req.user._id.toString()
            }
        });

        res.json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret,
                amount: booking.totalAmount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Confirm payment
export const confirmPayment = async (req, res) => {
    try {
        const { bookingId, paymentIntentId, paymentMethod } = req.body;

        const booking = await Booking.findById(bookingId).populate('machineId userId');
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Create payment record
        const payment = new Payment({
            bookingId,
            userId: req.user._id,
            amount: booking.totalAmount,
            paymentMethod: paymentMethod || 'card',
            transactionId: paymentIntentId,
            stripePaymentIntentId: paymentIntentId,
            status: 'completed'
        });

        await payment.save();

        // Update booking status
        booking.status = 'confirmed';
        await booking.save();

        // Send confirmation email
        await sendPaymentConfirmation(booking.userId.email, booking, payment);

        res.json({
            success: true,
            message: 'Payment confirmed successfully',
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('bookingId')
            .populate('userId', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user's payment history
export const getUserPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id })
            .populate('bookingId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all payments (admin)
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('userId', 'name email')
            .populate('bookingId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
