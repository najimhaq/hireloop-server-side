const express = require('express');
const companyRouter = express.Router();
const {
  createCompanyRegister,
  getAllRegisteredCompanies,
  getCompanyByRecruiterId,
  updateCompanyStatus,
} = require('../controller/company.controller');

const getCompanyById = require('../controller/registerCompanyController');
const { protect } = require('../middleware/authMiddleware');

companyRouter.get('/api/companies', getAllRegisteredCompanies);
companyRouter.get(
  '/api/companies/recruiter/:recruiterId',
  getCompanyByRecruiterId
);
companyRouter.get('/api/companies/:id', getCompanyById);

companyRouter.patch('/api/companies/:id/status', updateCompanyStatus);
companyRouter.post('/api/companies', createCompanyRegister);

module.exports = companyRouter;
