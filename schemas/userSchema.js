import mongoose from 'mongoose';
export const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    emailVerified: Boolean,
    image: String,
    role: String,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    collection: 'user',
    strict: false,
  }
);
