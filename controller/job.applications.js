const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const JobApplication = require('../models/jobApplicationModel');
const Job = require('../models/jobPostModel');

const getAllJobApplications = asyncHandler(async (req, res) => {
  const jobApplications = await JobApplication.find({}).lean();

  return res.status(200).json({
    success: true,
    message: 'Job applications retrieved successfully',
    count: jobApplications.length,
    data: jobApplications,
  });
});

const getSingleJobApplicationById = asyncHandler(async (req, res) => {
  const jobApplication = await JobApplication.findById(req.params.id).lean();

  return res.status(200).json({
    success: true,
    message: 'Job application retrieved successfully',
    data: jobApplication,
  });
});

// Create a new job application
const createJobApplication = asyncHandler(async (req, res) => {
  const {
    jobId,
    applicantName,
    applicantEmail,
    phone,
    linkedinUrl,
    resumeUrl,
    coverLetter,
  } = req.body;

  if (!jobId || !applicantName || !applicantEmail || !phone) {
    return res.status(400).json({
      success: false,
      message: 'jobId, applicantName, applicantEmail and phone are required',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid jobId format',
    });
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  try {
    const jobApplication = await JobApplication.create({
      job: jobId,
      applicant: req.user?.id || null,
      applicantName,
      applicantEmail,
      phone,
      linkedinUrl: linkedinUrl || '',
      resumeUrl: resumeUrl || '',
      coverLetter: coverLetter || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: jobApplication,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }
    throw error;
  }
});

module.exports = {
  getAllJobApplications,
  getSingleJobApplicationById,
  createJobApplication,
};
