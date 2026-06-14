const express = require('express');
const companyRouter = express.Router();
const {
  createCompanyRegister,
  getAllRegisteredCompanies,
  getCompanyByRecruiterId,
} = require('../controller/company.controller');

companyRouter.get('/api/companies', getAllRegisteredCompanies);
companyRouter.get(
  '/api/companies/recruiter/:recruiterId',
  getCompanyByRecruiterId
);
companyRouter.post('/api/companies', createCompanyRegister);

module.exports = companyRouter;
