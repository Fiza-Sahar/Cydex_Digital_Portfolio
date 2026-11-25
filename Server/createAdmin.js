
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { User } from './src/models/User.js';

// Fix for Windows Node.js querySrv ECONNREFUSED on MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore
}

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = 'admin@cydexdigital.com';
    const password = 'Admin@123456';
    
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('This email already exists.');
      return;
    }

    await User.create({
      name: 'Admin',
      email,
      password,
      role: 'admin',
      status: 'active',
    });

    console.log('Admin account created successfully.');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
