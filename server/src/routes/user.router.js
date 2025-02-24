const express = require('express');
const userRouter = express.Router();
const { register, getAllUsers, getUserWithId, updateUser, deleteUserWithId, createAdmin } = require("../controllers/user.controller");
const { authenticateToken } = require("../middlewares/auth.middleWare")
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")

userRouter.post('/users', convertValuesToLowercase, register);
userRouter.get('/users', getAllUsers);
userRouter.get('/users/:id', authenticateToken, getUserWithId);
userRouter.put('/users/:id', authenticateToken, convertValuesToLowercase, updateUser);
userRouter.delete('/users/:id', authenticateToken, deleteUserWithId);
userRouter.put('/users/:id/role', authenticateToken, convertValuesToLowercase, createAdmin);


module.exports = userRouter;
