const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');

const JobApplication = require('../schemas/jobApplicationCollection');


// Get all job applications
const getAllJobApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status } = req.query;

  const filter = {};
  if (status) filter.status = status;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [applications, total] = await Promise.all([
    JobApplication.find(filter)
      .populate({ path: 'job', populate: { path: 'companyId', select: 'companyName logo' } })
      .populate({ path: 'applicant', select: 'name email image' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),

    JobApplication.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    data: applications,
    total,
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

// Get job applications by applicant
const getApplicationsByApplicant = asyncHandler(async (req, res) => {
  const { applicantId } = req.params;

  console.log('req.params:', req.params);

  if (!applicantId || applicantId === 'undefined') {
    return res.status(400).json({
      success: false,
      message: 'Valid applicantId is required',
    });
  }

  const jobApplications = await JobApplication.find({ applicant: applicantId })
    .populate({
      path: 'job',
      select: 'jobTitle jobType location isRemote companyId',
      populate: {
        path: 'companyId',
        select: 'companyName logo location',
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    message: 'Job applications retrieved successfully',
    count: jobApplications.length,
    data: jobApplications,
  });
});

// Get a single job application by id
const getSingleJobApplicationById = asyncHandler(async (req, res) => {
  const jobApplication = await JobApplication.findById(req.params.id).lean();

  return res.status(200).json({
    success: true,
    message: 'Job application retrieved successfully',
    data: jobApplication,
  });
});

// Create a new job application post
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

//maybe admin er jonno
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    'pending',
    'reviewed',
    'shortlisted',
    'rejected',
    'hired',
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const application = await JobApplication.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!application) {
    return res
      .status(404)
      .json({ success: false, message: 'Application not found' });
  }

  return res.status(200).json({ success: true, data: application });
});

module.exports = {
  getAllJobApplications,
  getApplicationsByApplicant,
  getSingleJobApplicationById,
  createJobApplication,
  updateApplicationStatus,
};
