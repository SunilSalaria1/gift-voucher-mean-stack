const express = require('express');
const userRouter = express.Router();
const { register, getAllUsers, getUserWithId, updateUser, deleteUserWithId } = require("../controllers/user.controller");

userRouter.post('/register', register);
userRouter.get("/users", getAllUsers)
userRouter.get("/getUser/:id", getUserWithId)
userRouter.post("/updateUser/:id", updateUser)
userRouter.post("/deleteUser/:id", deleteUserWithId)

module.exports = userRouter;