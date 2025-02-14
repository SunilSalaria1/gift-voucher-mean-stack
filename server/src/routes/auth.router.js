const express = require('express');
const authRouter = express.Router();
const { loginUser, logoutUser } = require("../controllers/auth.controller");
// const { authenticateToken } = require("../middlewares/authMiddleWare")

authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);


module.exports = authRouter;