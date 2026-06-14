// routes/users.route.js
const express = require('express');
const userRouter = express.Router();
const getAllUsers = require('../controller/users.controllers');

userRouter.get('/api/users', getAllUsers);

module.exports = userRouter;
