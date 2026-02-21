import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Machine from '../models/Machine.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Maintenance from '../models/Maintenance.js';

dotenv.config();

// Sample data
const users = [
    {
        name: 'Admin User',
        email: 'admin@agrirental.com',
        password: 'admin123',
        role: 'admin',
        phone: '9876543210',
        address: 'Mumbai, Maharashtra'
    },
    {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: 'owner123',
        role: 'owner',
        phone: '9876543211',
        address: 'Pune, Maharashtra'
    },
    {
        name: 'Amit Sharma',
        email: 'amit@example.com',
        password: 'farmer123',
        role: 'farmer',
        phone: '9876543212',
        address: 'Nashik, Maharashtra'
    },
    {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'owner123',
        role: 'owner',
        phone: '9876543213',
        address: 'Ahmedabad, Gujarat'
    },
    {
        name: 'Suresh Reddy',
        email: 'suresh@example.com',
        password: 'farmer123',
        role: 'farmer',
        phone: '9876543214',
        address: 'Hyderabad, Telangana'
    }
];

const getMachines = (ownerIds) => [
    {
        ownerId: ownerIds[0],
        name: 'John Deere 5075E Tractor',
        type: 'Tractor',
        description: 'Powerful 75 HP tractor suitable for all farming operations',
        pricePerDay: 2500,
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
        status: 'available',
        specifications: {
            brand: 'John Deere',
            model: '5075E',
            year: 2022,
            horsepower: '75 HP',
            fuelType: 'Diesel',
            condition: 'Excellent'
        },
        location: 'Pune, Maharashtra'
    },
    {
        ownerId: ownerIds[0],
        name: 'Mahindra 575 DI Tractor',
        type: 'Tractor',
        description: 'Reliable 47 HP tractor for medium-scale farming',
        pricePerDay: 1800,
        imageUrl: 'https://images.unsplash.com/photo-1589894404629-c3d0b3d6c4f5?w=400',
        status: 'available',
        specifications: {
            brand: 'Mahindra',
            model: '575 DI',
            year: 2021,
            horsepower: '47 HP',
            fuelType: 'Diesel',
            condition: 'Good'
        },
        location: 'Pune, Maharashtra'
    },
    {
        ownerId: ownerIds[1],
        name: 'New Holland TC5070 Harvester',
        type: 'Harvester',
        description: 'Efficient combine harvester for wheat and rice',
        pricePerDay: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400',
        status: 'available',
        specifications: {
            brand: 'New Holland',
            model: 'TC5070',
            year: 2023,
            horsepower: '140 HP',
            fuelType: 'Diesel',
            condition: 'Excellent'
        },
        location: 'Ahmedabad, Gujarat'
    },
    {
        ownerId: ownerIds[1],
        name: 'Rotary Tiller - Heavy Duty',
        type: 'Cultivator',
        description: 'Heavy-duty rotary tiller for soil preparation',
        pricePerDay: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400',
        status: 'available',
        specifications: {
            brand: 'Fieldking',
            model: 'RT-180',
            year: 2022,
            horsepower: 'N/A',
            fuelType: 'Attachment',
            condition: 'Good'
        },
        location: 'Ahmedabad, Gujarat'
    },
    {
        ownerId: ownerIds[0],
        name: 'Seed Drill Machine',
        type: 'Seeder',
        description: 'Precision seed drill for uniform sowing',
        pricePerDay: 800,
        imageUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400',
        status: 'available',
        specifications: {
            brand: 'Lemken',
            model: 'Solitair 9',
            year: 2021,
            horsepower: 'N/A',
            fuelType: 'Attachment',
            condition: 'Good'
        },
        location: 'Pune, Maharashtra'
    },
    {
        ownerId: ownerIds[1],
        name: 'Agricultural Sprayer',
        type: 'Sprayer',
        description: 'Boom sprayer for pesticide and fertilizer application',
        pricePerDay: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
        status: 'available',
        specifications: {
            brand: 'Stihl',
            model: 'SR 450',
            year: 2022,
            horsepower: 'N/A',
            fuelType: 'Petrol',
            condition: 'Excellent'
        },
        location: 'Ahmedabad, Gujarat'
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Machine.deleteMany({});
        await Booking.deleteMany({});
        await Payment.deleteMany({});
        await Maintenance.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create users
        const createdUsers = await User.create(users);
        console.log(`✅ Created ${createdUsers.length} users`);

        // Get owner IDs
        const owners = createdUsers.filter(u => u.role === 'owner');
        const ownerIds = owners.map(o => o._id);

        // Create machines
        const machines = getMachines(ownerIds);
        const createdMachines = await Machine.create(machines);
        console.log(`✅ Created ${createdMachines.length} machines`);

        // Create sample bookings
        const farmer = createdUsers.find(u => u.role === 'farmer');
        const sampleBooking = new Booking({
            userId: farmer._id,
            machineId: createdMachines[0]._id,
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            totalDays: 7,
            totalAmount: 2500 * 7,
            status: 'confirmed'
        });
        await sampleBooking.save();
        console.log('✅ Created sample booking');

        // Create sample payment
        const samplePayment = new Payment({
            bookingId: sampleBooking._id,
            userId: farmer._id,
            amount: sampleBooking.totalAmount,
            paymentMethod: 'card',
            transactionId: 'TXN' + Date.now(),
            status: 'completed'
        });
        await samplePayment.save();
        console.log('✅ Created sample payment');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Sample Login Credentials:');
        console.log('Admin: admin@agrirental.com / admin123');
        console.log('Owner: rajesh@example.com / owner123');
        console.log('Farmer: amit@example.com / farmer123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
