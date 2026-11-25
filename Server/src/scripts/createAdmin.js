import dns from 'dns';

// Fix for Windows Node.js querySrv ECONNREFUSED on MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where setting custom DNS servers is disallowed
}

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { User } from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cydex_digital';

const createAdmin = async () => {
  try {
    const args = process.argv.slice(2);
    const email = args[0] || 'admin@cydexdigital.com';
    const password = args[1] || 'Admin@Cydex2026!';
    const name = args[2] || 'Cydex Administrator';

    if (!email || !password || password.length < 8) {
      console.error('Usage: node src/scripts/createAdmin.js <email> <password> [name]');
      console.error('Password must be at least 8 characters long.');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      user.password = password;
      user.role = 'admin';
      user.status = 'active';
      await user.save();
      console.log(`[Admin Setup] Existing account ${email} updated with administrative privileges.`);
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: 'admin',
        status: 'active',
        company: 'Cydex Digital HQ',
      });
      console.log(`[Admin Setup] Administrator account created successfully: ${email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Admin Setup Error]:', error.message);
    process.exit(1);
  }
};

createAdmin();
