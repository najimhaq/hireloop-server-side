// routes/users.route.js
const express = require('express');
const userRouter = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} = require('../controller/users.controllers');
const requireRole = require('../middleware/requireRole');
const { protect } = require('../middleware/tokenProtect');

userRouter.get('/api/users', protect, requireRole('admin'), getAllUsers);
userRouter.patch(
  '/api/users/:id/status',
  requireRole('admin'),
  protect,
  updateUserStatus
);
userRouter.patch(
  '/api/users/:id/role',
  requireRole('admin'),
  protect,
  updateUserRole
);
userRouter.delete('/api/users/:id', requireRole('admin'), protect, deleteUser);

module.exports = userRouter;
