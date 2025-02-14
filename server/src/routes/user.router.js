const express = require('express');
const userRouter = express.Router();
const { register, getAllUsers, getUserWithId, updateUser, deleteUserWithId, createAdmin, getAllAdmins } = require("../controllers/user.controller");
const { authenticateToken } = require("../middlewares/authMiddleWare")

userRouter.post('/user', authenticateToken, register)
userRouter.get("/users", authenticateToken, getAllUsers)
userRouter.get("/user/:id", authenticateToken, getUserWithId)
userRouter.put("/user/:id", authenticateToken, updateUser)
userRouter.delete("/user/:id", authenticateToken, deleteUserWithId)
userRouter.put("/role", authenticateToken, createAdmin)
// userRouter.get("/getAllAdmins", authenticateToken, getAllAdmins)
// userRouter.post('/register', register);
// userRouter.get("/users", getAllUsers)
// userRouter.get("/getUser/:id", getUserWithId)
// userRouter.put("/updateUser/:id", updateUser)
// userRouter.post("/deleteUser/:id", deleteUserWithId)
// userRouter.post("/createAdminRemoveAdmin", createAdmin)
// userRouter.get("/getAllAdmins", getAllAdmins)

module.exports = userRouter;