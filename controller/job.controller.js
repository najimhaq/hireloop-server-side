const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const JobPost = require('../schemas/jobPostSchema');

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
    companyName: req.body.companyId?.companyName || '',
    companyLogo: req.body.companyLogo || '',
    status: 'pending',
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
    const { companyId, status, category, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (companyId) {
      if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid companyId' });
      }
      filter.companyId = new mongoose.Types.ObjectId(companyId);
    }

    if (status) filter.status = status;
    if (category) filter.jobCategory = category;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // max 50
    const skip = (pageNum - 1) * limitNum;

    // ✅ Parallel query — faster
    const [jobs, total, activeCount, closedCount] = await Promise.all([
      JobPost.find(filter)
        .populate({ path: 'companyId', select: 'companyName logo location' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      JobPost.countDocuments(filter),

      // companyId filter রেখে status আলাদা count
      JobPost.countDocuments({ ...filter, status: 'active' }),
      JobPost.countDocuments({ ...filter, status: 'closed' }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully',
      data: jobs,
      total,
      activeCount,
      closedCount,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: jobs.length,
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

// update job by id
const updateJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid job id' });
  }

  // ✅ Manual salary validation
  const { minSalary, maxSalary } = req.body;
  if (minSalary !== undefined && maxSalary !== undefined) {
    if (Number(maxSalary) < Number(minSalary)) {
      return res.status(400).json({
        success: false,
        message: 'Max salary must be greater than or equal to min salary',
      });
    }
  }

  const job = await JobPost.findByIdAndUpdate(id, req.body, {
    returnDocument: 'after',
    runValidators: false,
  });

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  return res
    .status(200)
    .json({ success: true, message: 'Job updated successfully', data: job });
});

// delete job by id
const deleteJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid job id' });
  }

  const job = await JobPost.findByIdAndDelete(id);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  return res
    .status(200)
    .json({ success: true, message: 'Job deleted successfully' });
});

// update job status - admin
const updateJobStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ['active', 'pending', 'closed', 'draft'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid job id' });
  }

  const job = await JobPost.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: false }
  );

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  return res.status(200).json({ success: true, message: 'Job status updated', data: job });
});


module.exports = {
  createJobPost,
  getAllJobPosts,
  getSingleJobById,
  updateJobById,
  deleteJobById,
  updateJobStatus,
};
