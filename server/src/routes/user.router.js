const express = require('express');
const userRouter = express.Router();
const { register, getAllUsers, getUserWithId, updateUser, deleteUserWithId, createAdmin, updateUserPick, getGiftInvertory } = require("../controllers/user.controller");
const { authenticateToken } = require("../middlewares/authMiddleWare")

userRouter.post('/users', authenticateToken, register);
userRouter.get('/users', authenticateToken, getAllUsers);
userRouter.get('/users/:id', authenticateToken, getUserWithId);
userRouter.put('/users/:id', authenticateToken, updateUser);
userRouter.delete('/users/:id', authenticateToken, deleteUserWithId);
userRouter.put('/users/:id/role', authenticateToken, createAdmin);
userRouter.put('/users/:id/gifts', authenticateToken, updateUserPick);
userRouter.get('/gifts', authenticateToken, getGiftInvertory); // Get all gift inventory

module.exports = userRouter;
