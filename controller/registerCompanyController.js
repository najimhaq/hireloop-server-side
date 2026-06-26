const asyncHandler = require('../middleware/asyncHandler');
const RegisterCompany = require('../schemas/registerCompanySchema');

// controllers/registerCompanyController.js
const getCompanyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await RegisterCompany.findById(id);

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: company,
  });
});
module.exports = getCompanyById;
