const express = require('express');
const companyRouter = express.Router();

const {
  createCompanyRegister,
  getAllRegisteredCompanies,
  getCompanyByRecruiterId,
  updateCompanyStatus,
} = require('../controller/company.controller');

const getCompanyById = require('../controller/registerCompanyController');
const { protect } = require('../middleware/tokenProtect');
const requireRole = require('../middleware/requireRole');


// ── Public ──
companyRouter.get('/api/companies', getAllRegisteredCompanies);
companyRouter.get('/api/companies/:id', getCompanyById);

// ── Recruiter / Admin ──
companyRouter.get(
  '/api/companies/recruiter/:recruiterId',
  protect,
  requireRole('recruiter', 'admin'),
  getCompanyByRecruiterId
);
companyRouter.post(
  '/api/companies',
  protect,
  requireRole('recruiter'),
  createCompanyRegister
);

// ── Admin only ──
companyRouter.patch(
  '/api/companies/:id/status',
  protect,
  requireRole('admin'),
  updateCompanyStatus
);

module.exports = companyRouter;
