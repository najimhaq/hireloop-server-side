// routes/job.route.js
const express = require('express');
const jobRouter = express.Router();
const {
  createJobPost,
  getAllJobPosts,
  getSingleJobById,
  updateJobById,
  deleteJobById,
  updateJobStatus,
} = require('../controller/job.controller');

jobRouter.get('/api/jobs', getAllJobPosts);
jobRouter.get('/api/jobs/:id', getSingleJobById);
jobRouter.post('/api/jobs', createJobPost);
jobRouter.put('/api/jobs/:id', updateJobById);
jobRouter.delete('/api/jobs/:id', deleteJobById);
jobRouter.patch('/api/jobs/:id/status', updateJobStatus);

module.exports = jobRouter;
