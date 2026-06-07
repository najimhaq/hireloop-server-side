const asyncHandler = require('../middleware/asyncHandler');
const RegisterCompany = require('../models/registerCompanyModel');

const createCompanyRegister = asyncHandler(async (req, res) => {
  const payload = {
    companyName: req.body.companyName?.trim(),
    description: req.body.description?.trim(),
    industry: req.body.industry?.trim(),
    location: req.body.location?.trim(),
    website: req.body.website?.trim(),
    employeeCount: req.body.employeeCount,
    logo: req.body.logo || null,
    recruiterId: req.body.recruiterId || null,
  };


  const company = await RegisterCompany.create(payload);

  return res.status(201).json({
    success: true,
    message: 'Company registered successfully',
    data: company,
  });
});

const getAllRegisteredCompanies = asyncHandler(async (req, res) => {
  const companies = await RegisterCompany.find({});

  return res.status(200).json({
    success: true,
    count: companies.length,
    data: companies,
  });
})
const getCompanyByRecruiterId = asyncHandler(async (req, res) => {
  const { recruiterId } = req.params;

  const company = await RegisterCompany.findOne({ recruiterId });

  return res.status(200).json({
    success: true,
    data: company || null,
  });
});

module.exports = {
  createCompanyRegister,
  getAllRegisteredCompanies,
  getCompanyByRecruiterId,
};
