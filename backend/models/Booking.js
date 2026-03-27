import mongoose from 'mongoose';

// Auto-generate a receipt number
function generateReceiptNumber() {
    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `AGR-${year}-${rand}`;
}

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    machineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    totalDays: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    // UPI Payment tracking
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'pending_verification', 'paid'],
        default: 'unpaid'
    },
    upiRef: {
        type: String // UPI Transaction Reference entered by farmer
    },
    // Flipkart-style delivery/booking status timeline
    deliveryStatus: {
        type: String,
        enum: ['booked', 'payment_received', 'confirmed', 'dispatched', 'active', 'completed', 'cancelled'],
        default: 'booked'
    },
    receiptNumber: {
        type: String,
        default: generateReceiptNumber
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Validate end date is after start date
bookingSchema.pre('save', function (next) {
    if (this.endDate <= this.startDate) {
        next(new Error('End date must be after start date'));
    }
    next();
});

// Index for conflict checking
bookingSchema.index({ machineId: 1, startDate: 1, endDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
