const express = require('express');
const applicationRouter = express.Router();
const {
  getAllJobApplications,
  getApplicationsByApplicant,
  getSingleJobApplicationById,
  createJobApplication,
} = require('../controller/job.applications');
const { protect } = require('../middleware/authMiddleware');

applicationRouter.get('/api/applications', getAllJobApplications);

applicationRouter.get(
  '/api/applications/applicant/:applicantId',
  getApplicationsByApplicant
);

applicationRouter.get('/api/applications/:id', getSingleJobApplicationById);

applicationRouter.post('/api/applications', protect, createJobApplication);

module.exports = applicationRouter;
