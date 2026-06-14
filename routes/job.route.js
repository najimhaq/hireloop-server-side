// routes/job.route.js
const express = require('express');
const jobRouter = express.Router();
const {
  createJobPost,
  getAllJobPosts,
  getSingleJobById,

} = require('../controller/job.controller');


jobRouter.get('/api/jobs', getAllJobPosts);
jobRouter.get('/api/jobs/:id', getSingleJobById);
jobRouter.post('/api/jobs', createJobPost);


module.exports = jobRouter;
