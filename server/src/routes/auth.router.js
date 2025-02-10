const express = require('express');
const authRouter = express.Router();
const { loginUser, logoutUser } = require("../controllers/auth.controller");
const { authenticateToken } = require("../middlewares/authMiddleWare")

authRouter.post('/loginUser', loginUser);
authRouter.post('/logoutUser', logoutUser);


module.exports = authRouter;