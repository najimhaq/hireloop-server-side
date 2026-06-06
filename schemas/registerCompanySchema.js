const mongoose = require('mongoose');

const registerCompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true,
      enum: ['Technology', 'Design', 'Marketing', 'Finance', 'Other'],
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    website: {
      type: String,
      required: [true, 'Website URL is required'],
      trim: true,
    },

    employeeCount: {
      type: String,
      required: [true, 'Employee count range is required'],
      enum: [
        '1-10 employees',
        '11-50 employees',
        '51-200 employees',
        '201+ employees',
      ],
    },

    logo: {
      type: String,
      default: null,
    },
    recruiterId: {
      type: String,
      required: [true, 'Recruiter id is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = registerCompanySchema;
