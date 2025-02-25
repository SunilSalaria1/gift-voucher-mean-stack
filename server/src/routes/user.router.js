const express = require('express');
const userRouter = express.Router();
const { getAllUsers, getUserWithId, updateUser, deleteUserWithId } = require("../controllers/user.controller");
const { authenticateToken } = require("../middlewares/auth.middleWare")
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")

// routes for the  delete user, update user ,get asinge user data by Id and get all users.
userRouter.get('/users', getAllUsers);
userRouter.get('/users/:id', authenticateToken, getUserWithId);
userRouter.put('/users/:id', authenticateToken, convertValuesToLowercase, updateUser);
userRouter.delete('/users/:id', authenticateToken, deleteUserWithId);

module.exports = userRouter;
