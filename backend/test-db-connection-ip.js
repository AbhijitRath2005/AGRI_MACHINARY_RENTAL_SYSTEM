import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Override URI for test
const uri = 'mongodb://127.0.0.1:27017/agri-rental-system';

const connectDB = async () => {
    try {
        console.log(`Attempting to connect to: ${uri}`);
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
};

connectDB();
