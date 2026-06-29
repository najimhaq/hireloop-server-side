const express = require('express');
const applicationRouter = express.Router();

const {
  getAllJobApplications,
  getApplicationsByApplicant,
  getSingleJobApplicationById,
  createJobApplication,
  updateApplicationStatus,
} = require('../controller/job.applications');
const { protect } = require('../middleware/tokenProtect');
const requireRole = require('../middleware/requireRole');



// ── Admin only ──
applicationRouter.get(
  '/api/applications',
  protect,
  requireRole('admin'),
  getAllJobApplications
);

// ── Seeker — নিজের applications দেখবে ──
applicationRouter.get(
  '/api/applications/applicant/:applicantId',
  protect,
  requireRole('seeker', 'admin'),
  getApplicationsByApplicant
);

// ── Recruiter / Admin — specific application দেখবে ──
applicationRouter.get(
  '/api/applications/:id',
  protect,
  requireRole('recruiter', 'admin'),
  getSingleJobApplicationById
);

// ── Seeker — apply করবে ──
applicationRouter.post(
  '/api/applications',
  protect,
  requireRole('seeker'),
  createJobApplication
);

applicationRouter.patch(
  '/api/applications/:id/status',
  protect,
  requireRole('admin', 'recruiter'),
  updateApplicationStatus
);
module.exports = applicationRouter;
