// models/registerCompanyModel.js
const mongoose = require('mongoose');
const registerCompanySchema = require('../schemas/registerCompanySchema');


const RegisterCompany =
  mongoose.models.RegisterCompany ||
  mongoose.model('RegisterCompany', registerCompanySchema);

module.exports = RegisterCompany;
