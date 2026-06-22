// models/application.model.js
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPost',
      required: [true, 'Job reference is required'],
      index: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },

    applicantEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },

    resumeUrl: {
      type: String,
      trim: true,
      default: '',
    },

    coverLetter: {
      type: String,
      trim: true,
      default: '',
    },

    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = jobApplicationSchema;
