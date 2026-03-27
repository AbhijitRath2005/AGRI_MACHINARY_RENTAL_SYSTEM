import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendWelcomeEmail } from '../utils/emailService.js';

// Register new user
export const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, address, vehicleNumber, vehiclePurchaseDate } = req.body;

        // Validate required fields before hitting DB
        if (!phone || !phone.trim()) {
            return res.status(400).json({ success: false, message: 'Phone number is required' });
        }
        if (!address || !address.trim()) {
            return res.status(400).json({ success: false, message: 'Address is required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // Build user data
        const userData = {
            name,
            email,
            password,
            role: role || 'farmer',
            phone: phone.trim(),
            address: address.trim()
        };

        // Add owner-specific vehicle fields
        if (role === 'owner') {
            if (vehicleNumber) userData.vehicleNumber = vehicleNumber;
            if (vehiclePurchaseDate) userData.vehiclePurchaseDate = vehiclePurchaseDate;
            if (req.file) {
                userData.vehicleProofUrl = '/uploads/vehicle-proofs/' + req.file.filename;
            }
        }

        // Create new user
        const user = new User(userData);
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send welcome email (non-blocking)
        sendWelcomeEmail(email, name, role || 'farmer');

        res.status(201).json({
            success: true,
            message: 'Account created successfully! Check your email for a welcome message.',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        // Handle Mongoose validation errors nicely
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(e => e.message).join('. ');
            return res.status(400).json({ success: false, message });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact admin.'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from response
        user.password = undefined;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
