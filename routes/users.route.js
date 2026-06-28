// routes/users.route.js
const express = require('express');
const userRouter = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} = require('../controller/users.controllers');
const verifyTokenMiddleware = require('../middleware/VerifyTokenMiddleware');
const requireAdmin = require('../middleware/requireAdmin');

userRouter.get('/api/users', getAllUsers);
userRouter.patch('/api/users/:id/status', updateUserStatus);
userRouter.patch('/api/users/:id/role', updateUserRole);
userRouter.delete('/api/users/:id', deleteUser);

module.exports = userRouter;
