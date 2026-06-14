const mongoose = require('mongoose');
const jobApplicationSchema = require('../schemas/jobApplicationCollection');

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
