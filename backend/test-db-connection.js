import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        console.log(`Attempting to connect to: ${process.env.MONGODB_URI}`);
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        console.error(error);
    }
};

connectDB();
