import mongoose from 'mongoose';
import { createAdminSeed } from './admin.seed.js';

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        mongoose.connection.on('connecting', () => {
            console.log('Connecting to MongoDB...');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });
        mongoose.connection.on('open', () => {
            console.log('MongoDB connection open');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        await mongoose.connect(process.env.URI_MONGODB, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });

        // Crear admin seed después de conectar
        await createAdminSeed();

    } catch (err) {
        console.error('Error connecting to DB:', err);
        process.exit(1);
    }
};

export const gracefulShutdown = async (signal) => {
    try {
        await mongoose.connection.close();
        console.log(`MongoDB connection closed due to ${signal}`);
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));