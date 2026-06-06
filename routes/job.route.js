// routes/job.route.js
const express = require('express');
const router = express.Router();
const {
  createJobPost,
  getAllJobPosts,
} = require('../controller/job.controller');
const { createCompanyRegister, getCompanyByRecruiterId } = require('../controller/company.controller');

router.get('/api/jobs', getAllJobPosts);
router.get('/api/companies/recruiter/:recruiterId', getCompanyByRecruiterId);
router.post('/api/jobs', createJobPost);
router.post('/api/companies', createCompanyRegister);

module.exports = router;
