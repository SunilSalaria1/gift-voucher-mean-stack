const express = require('express');
const userRouter = express.Router();
const { getUserById, updateUserById, getAllUsers, deleteUserById } = require("../controllers/user.controller");
const { authenticateToken } = require("../middlewares/auth.middleWare")

// routes for the  delete user, update user ,get asinge user data by Id and get all users.
userRouter.get('/users', authenticateToken, getAllUsers);
userRouter.get('/users/:id', authenticateToken, getUserById);
userRouter.put('/users/:id', authenticateToken, updateUserById);
userRouter.delete('/users/:id', authenticateToken, deleteUserById);

module.exports = userRouter;
