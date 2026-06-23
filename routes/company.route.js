const express = require('express');
const companyRouter = express.Router();
const {
  createCompanyRegister,
  getAllRegisteredCompanies,
  getCompanyByRecruiterId,
} = require('../controller/company.controller');

const getCompanyById = require('../controller/registerCompanyController');

companyRouter.get('/api/companies', getAllRegisteredCompanies);
companyRouter.get(
  '/api/companies/recruiter/:recruiterId',
  getCompanyByRecruiterId
);
companyRouter.get('/api/companies/:id', getCompanyById);
companyRouter.post('/api/companies', createCompanyRegister);

module.exports = companyRouter;
