// models/jobPostModel.js
const mongoose = require('mongoose');
const jobPostSchema = require('../schemas/jobPostSchema');

const JobPost =
  mongoose.models.JobPost || mongoose.model('JobPost', jobPostSchema);

module.exports = JobPost;
