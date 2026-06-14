const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token, // ← এটাই frontend নেবে
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = getAllUsers;
