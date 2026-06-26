// company.controller.js

const asyncHandler = require('../middleware/asyncHandler');
const RegisterCompany = require('../schemas/registerCompanySchema');

const createCompanyRegister = asyncHandler(async (req, res) => {
  const {
    companyName,
    description,
    industry,
    location,
    website,
    employeeCount,
    logo,
    recruiterId,
  } = req.body;

  if (!recruiterId) {
    return res
      .status(400)
      .json({ success: false, message: 'Recruiter ID is required' });
  }

  const company = await RegisterCompany.create({
    companyName: companyName?.trim(),
    description: description?.trim(),
    industry: industry?.trim(),
    location: location?.trim(),
    website: website?.trim(),
    employeeCount,
    logo: logo || null,
    status: 'pending',
    recruiterId,
  });

  return res
    .status(201)
    .json({
      success: true,
      message: 'Company registered successfully',
      data: company,
    });
});

const getAllRegisteredCompanies = asyncHandler(async (req, res) => {
  const companies = await RegisterCompany.find({});
  return res
    .status(200)
    .json({ success: true, count: companies.length, data: companies });
});

const getCompanyByRecruiterId = asyncHandler(async (req, res) => {
  const { recruiterId } = req.params;
  const company = await RegisterCompany.findOne({ recruiterId });
  return res.status(200).json({ success: true, data: company || null });
});

// update company status
const updateCompanyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const company = await RegisterCompany.findByIdAndUpdate(
    req.params.id,
    { status },
    {returnDocument: 'after'}
  );

  if (!company) {
    return res
      .status(404)
      .json({ success: false, message: 'Company not found' });
  }

  return res.status(200).json({ success: true, data: company });
});

module.exports = {
  createCompanyRegister,
  getAllRegisteredCompanies,
  getCompanyByRecruiterId,
  updateCompanyStatus, // ✅ এখন এটা properly export হচ্ছে
};
