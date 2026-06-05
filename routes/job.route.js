// routes/job.route.js
const express = require('express');
const router = express.Router();
const {
  createJobPost,
  getAllJobPosts,
} = require('../controller/job.controller');

router.post('/api/jobs', createJobPost);
router.get('/api/jobs', getAllJobPosts);

module.exports = router;
