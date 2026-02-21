import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Machine name is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Machine type is required'],
        enum: ['Tractor', 'Harvester', 'Plough', 'Seeder', 'Sprayer', 'Cultivator', 'Other']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    pricePerDay: {
        type: Number,
        required: [true, 'Price per day is required'],
        min: [0, 'Price cannot be negative']
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/400x300?text=Agricultural+Machine'
    },
    status: {
        type: String,
        enum: ['available', 'rented', 'maintenance'],
        default: 'available'
    },
    specifications: {
        brand: String,
        model: String,
        year: Number,
        horsepower: String,
        fuelType: String,
        condition: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair'],
            default: 'Good'
        }
    },
    location: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for search optimization
machineSchema.index({ type: 1, status: 1, pricePerDay: 1 });

const Machine = mongoose.model('Machine', machineSchema);

export default Machine;
