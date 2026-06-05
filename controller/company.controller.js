const asyncHandler = require("../middleware/asyncHandler");
const RegisterCompany = require("../models/registerCompanyModel");

//Create a Company Register
const createCompanyRegister = asyncHandler(async (req, res) => {
  const payload = {
    companyName: req.body.companyName?.trim(),
    description: req.body.description?.trim(),
    industry: req.body.industry,
    location: req.body.location?.trim(),
    website: req.body.website?.trim(),
    employeeCount: req.body.employeeCount,
    logo: req.body.logo || null,
  };

  try {
    const company = await RegisterCompany.create(payload);

    return res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      data: company,
    });
  } catch (error) {
    console.error('create company error:', error);
    console.error('validation details:', error.errors);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to register company',
      error: error.errors || null,
    });
  }
});

module.exports = { createCompanyRegister };
