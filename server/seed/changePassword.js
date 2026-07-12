import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const changePassword = async () => {
  try {
    await connectDB();
    
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found!');
      process.exit(1);
    }
    
    admin.password = 'sanika@777';
    await admin.save(); // pre-save hook will hash it
    
    console.log(`✅ Password changed successfully for admin: ${admin.email}`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

changePassword();
