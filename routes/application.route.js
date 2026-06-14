const express = require('express');
const applicationRouter = express.Router();
const {
  createJobApplication,
  getAllJobApplications,
  getSingleJobApplicationById,
} = require('../controller/job.applications');
const { protect } = require('../middleware/authMiddleware');

applicationRouter.get('/api/applications', getAllJobApplications);
applicationRouter.get('/api/applications/:id', getSingleJobApplicationById);
applicationRouter.post('/api/applications',protect, createJobApplication);

module.exports = applicationRouter;
