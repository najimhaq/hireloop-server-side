const mongoose = require('mongoose');
const JobPost = require('../models/jobPostModel');
const asyncHandler = require('../middleware/asyncHandler');

// Create a new job post
const createJobPost = asyncHandler(async (req, res) => {
  const payload = {
    jobTitle: req.body.jobTitle?.trim(),
    jobCategory: req.body.jobCategory,
    jobType: req.body.jobType,
    minSalary: Number(req.body.minSalary),
    maxSalary: Number(req.body.maxSalary),
    currency: req.body.currency || 'USD',
    location: req.body.isRemote ? 'Remote' : req.body.location?.trim(),
    isRemote: req.body.isRemote === true || req.body.isRemote === 'true',
    deadline: new Date(req.body.deadline),
    responsibilities: req.body.responsibilities?.trim() || '',
    requirements: req.body.requirements?.trim() || '',
    benefits: req.body.benefits?.trim() || '',
    experienceLevel: req.body.experienceLevel,
    vacancies: Number(req.body.vacancies),
    companyId: req.body.companyId || req.user?.companyId,
    companyName: req.body.companyName || '',
    companyLogo: req.body.companyLogo || '',
    status: 'active',
    isPubliclyVisible: true,
  };

  try {
    const job = await JobPost.create(payload);

    return res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    console.error('validation details:', error.errors);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create job',
      error: error.errors || null,
    });
  }
});

// Get all job posts with optional filters
const getAllJobPosts = asyncHandler(async (req, res) => {
  try {
    const { companyId, status } = req.query;

    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (status) filter.status = status;

    const jobs = await JobPost.find(filter).populate({
      path: 'companyId',
      select: 'companyName logo location',
    });

    return res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully',
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error('get all jobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve jobs',
      error: error.message || null,
    });
  }
});

//get single job by id

const getSingleJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid job id',
    });
  }

  const job = await JobPost.findById(id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Job retrieved successfully',
    data: job,
  });
});

module.exports = { createJobPost, getAllJobPosts, getSingleJobById };
