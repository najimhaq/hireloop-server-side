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
const { protect } = require('../middleware/tokenProtect');
const requireRole = require('../middleware/requireRole');



// ── Public ──
jobRouter.get('/api/jobs', getAllJobPosts);
jobRouter.get('/api/jobs/:id', getSingleJobById);

// ── Protected (recruiter / admin only) ──
jobRouter.post(
  '/api/jobs',
  protect,
  requireRole('recruiter', 'admin'),
  createJobPost
);
jobRouter.put(
  '/api/jobs/:id',
  protect,
  requireRole('recruiter', 'admin'),
  updateJobById
);
jobRouter.delete(
  '/api/jobs/:id',
  protect,
  requireRole('recruiter', 'admin'),
  deleteJobById
);
jobRouter.patch(
  '/api/jobs/:id/status',
  protect,
  requireRole('recruiter', 'admin'),
  updateJobStatus
);

module.exports = jobRouter;
