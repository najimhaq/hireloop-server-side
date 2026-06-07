// routes/job.route.js
const express = require('express');
const router = express.Router();
const {
  createJobPost,
  getAllJobPosts,
  getSingleJobById,

} = require('../controller/job.controller');
const { createCompanyRegister,getAllRegisteredCompanies, getCompanyByRecruiterId } = require('../controller/company.controller');
const { getAllUsers } = require('../controller/users.controllers');


router.get('/api/users', getAllUsers);
router.get('/api/jobs', getAllJobPosts);
router.get('/api/jobs/:id', getSingleJobById);
router.get('/api/companies', getAllRegisteredCompanies);
router.get('/api/companies/recruiter/:recruiterId', getCompanyByRecruiterId);
router.post('/api/jobs', createJobPost);
router.post('/api/companies', createCompanyRegister);

module.exports = router;
