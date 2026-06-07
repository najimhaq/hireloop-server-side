const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/userModel');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).lean();

  if (users.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No users found',
      data: [],
    });
  }
  // console.log('users:', users);

  return res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

module.exports = { getAllUsers };
