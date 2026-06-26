// schemas/jobPostSchema.js
const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    jobCategory: {
      type: String,
      required: [true, 'Job category is required'],
      trim: true,
      lowercase: true,
    },
    jobType: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
    },
    experienceLevel: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: ['entry', 'mid', 'senior'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    minSalary: {
      type: Number,
      required: [true, 'Minimum salary is required'],
      min: 0,
    },
    maxSalary: {
      type: Number,
      required: [true, 'Maximum salary is required'],
      min: 0,
      validate: {
        validator: function (value) {
          return value >= this.minSalary;
        },
        message: 'Max salary must be greater than or equal to min salary',
      },
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      trim: true,
    },
    vacancies: {
      type: Number,
      required: [true, 'Vacancies is required'],
      min: 1,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    responsibilities: {
      type: String,
      default: '',
      trim: true,
    },
    requirements: {
      type: String,
      default: '',
      trim: true,
    },
    benefits: {
      type: String,
      default: '',
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ String → ObjectId
      ref: 'RegisterCompany',
      required: [true, 'RegisterCompany ID is required'],
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    isPubliclyVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const JobPost =
  mongoose.models.JobPost || mongoose.model('JobPost', jobPostSchema);

module.exports = JobPost;
