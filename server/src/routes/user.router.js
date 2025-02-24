const express = require('express');
const userRouter = express.Router();
const { register, getAllUsers, getUserWithId, updateUser, deleteUserWithId, createAdmin, updateUserPick, getGiftInvertory, deleteUserPick } = require("../controllers/user.controller");
const { authenticateToken } = require("../middlewares/auth.middleWare")
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")

userRouter.post('/users', authenticateToken, convertValuesToLowercase, register);
userRouter.get('/users', authenticateToken, getAllUsers);
userRouter.get('/users/:id', authenticateToken, getUserWithId);
userRouter.put('/users/:id', authenticateToken, convertValuesToLowercase, updateUser);
userRouter.delete('/users/:id', authenticateToken, deleteUserWithId);
userRouter.put('/users/:id/role', authenticateToken, convertValuesToLowercase, createAdmin);
userRouter.put('/users/:id/gifts', authenticateToken, convertValuesToLowercase, updateUserPick);
userRouter.delete('/users/:id/gifts', authenticateToken, deleteUserPick);
userRouter.get('/gifts', authenticateToken, getGiftInvertory); // Get all gift inventory

module.exports = userRouter;
