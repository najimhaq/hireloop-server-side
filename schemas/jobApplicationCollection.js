// models/application.model.js
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPost',
      required: [true, 'JobPost reference is required'],
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

// Unique compound index — job and applicant
jobApplicationSchema.index({ job: 1, applicantEmail: 1 }, { unique: true });

// Error hook to check for duplicate applications
jobApplicationSchema.post('save', function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error('You have already applied for this job'));
  } else {
    next(error);
  }
});

const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
