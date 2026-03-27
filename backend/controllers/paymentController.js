import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Create payment intent (Stripe - legacy)
export const createPaymentIntent = async (req, res) => {
    try {
        if (!stripe) {
            return res.status(400).json({ success: false, message: 'Stripe not configured. Use UPI payment.' });
        }
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(booking.totalAmount * 100),
            currency: 'inr',
            metadata: { bookingId: booking._id.toString(), userId: req.user._id.toString() }
        });
        res.json({ success: true, data: { clientSecret: paymentIntent.client_secret, amount: booking.totalAmount } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Confirm Stripe payment (legacy)
export const confirmPayment = async (req, res) => {
    try {
        const { bookingId, paymentIntentId, paymentMethod } = req.body;
        const booking = await Booking.findById(bookingId).populate('machineId userId');
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

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
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';
        booking.deliveryStatus = 'confirmed';
        await booking.save();

        res.json({ success: true, message: 'Payment confirmed successfully', data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Confirm UPI payment (farmer submits UPI ref)
export const confirmUpiPayment = async (req, res) => {
    try {
        const { bookingId, upiRef } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ success: false, message: 'Payment already confirmed' });
        }

        // Generate a transaction ID from UPI ref
        const transactionId = `UPI-${upiRef}-${Date.now()}`;

        // Create a payment record
        const payment = new Payment({
            bookingId,
            userId: req.user._id,
            amount: booking.totalAmount,
            paymentMethod: 'upi',
            upiId: '7205389498@nyes',
            upiRef,
            transactionId,
            status: 'pending' // Owner will confirm; mark completed when owner confirms
        });
        await payment.save();

        // Update booking payment & delivery status
        booking.paymentStatus = 'pending_verification';
        booking.upiRef = upiRef;
        booking.deliveryStatus = 'payment_received';
        await booking.save();

        res.json({
            success: true,
            message: 'UPI payment submitted. Awaiting owner confirmation.',
            data: { payment, booking }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get receipt for a booking
export const getReceipt = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId)
            .populate('userId', 'name email phone')
            .populate({
                path: 'machineId',
                populate: { path: 'ownerId', select: 'name email phone' }
            });

        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        // Allow farmer or machine owner or admin to view
        const isOwner = booking.machineId?.ownerId?._id?.toString() === req.user._id.toString();
        const isFarmer = booking.userId?._id?.toString() === req.user._id.toString();
        if (!isFarmer && !isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const payment = await Payment.findOne({ bookingId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                receiptNumber: booking.receiptNumber,
                booking,
                payment,
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('bookingId')
            .populate('userId', 'name email');
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's payment history
export const getUserPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id })
            .populate('bookingId')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all payments (admin)
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('userId', 'name email')
            .populate('bookingId')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
