const mongoose = require('mongoose');
const User = require('../schemas/userSchema');
const asyncHandler = require('../middleware/asyncHandler');


// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, status, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    data: users,
    total,
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum),
    count: users.length,
  });
});

// update user status
const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ['active', 'suspended', 'inactive'];
  if (!allowed.includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid status value' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: 'after' }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    message: `User ${status} successfully`,
    data: user,
  });
});

//  update user role
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const allowed = ['seeker', 'recruiter', 'admin'];
  if (!allowed.includes(role)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid role value' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { returnDocument: 'after' }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    data: user,
  });
});

//user delete
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: user,
  });
});
module.exports = { getAllUsers, updateUserStatus, updateUserRole, deleteUser };
