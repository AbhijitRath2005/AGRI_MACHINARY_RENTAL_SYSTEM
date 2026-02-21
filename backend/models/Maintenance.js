import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
    machineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    scheduledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: [true, 'Maintenance description is required']
    },
    scheduledDate: {
        type: Date,
        required: [true, 'Scheduled date is required']
    },
    completedDate: {
        type: Date
    },
    cost: {
        type: Number,
        default: 0,
        min: [0, 'Cost cannot be negative']
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'approved'],
        default: 'scheduled'
    },
    notes: {
        type: String
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
