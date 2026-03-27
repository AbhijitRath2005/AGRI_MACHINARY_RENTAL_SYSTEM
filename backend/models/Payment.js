import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount cannot be negative']
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash', 'upi', 'bank_transfer'],
        default: 'upi'
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    upiId: {
        type: String,
        default: '7205389498@nyes'
    },
    upiRef: {
        type: String // Transaction reference provided by farmer
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    invoiceUrl: {
        type: String
    },
    stripePaymentIntentId: {
        type: String
    }
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
