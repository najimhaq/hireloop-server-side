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
      enum: [
        'Technology',
        'Finance',
        'Marketing',
        'Healthcare',
        'Education',
        'E-commerce',
        'Design',
        'Software',
        'Real Estate',
        'Other',
      ],
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
        '201-500 employees',
        '500+ employees',
      ],
    },

    logo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = registerCompanySchema;
