const express = require('express');
const userRouter = express.Router();
const { register, getAllUsers, getUserWithId, updateUser, deleteUserWithId } = require("../controllers/user.controller");
const { authenticateToken } = require("../middlewares/auth.middleWare")
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")

// routes for the create user, delete user, update user and get all users.
userRouter.post('/users', convertValuesToLowercase, register);
userRouter.get('/users', getAllUsers);
userRouter.get('/users/:id', authenticateToken, getUserWithId);
userRouter.put('/users/:id', authenticateToken, convertValuesToLowercase, updateUser);
userRouter.delete('/users/:id', authenticateToken, deleteUserWithId);

module.exports = userRouter;
