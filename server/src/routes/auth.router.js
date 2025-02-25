const express = require('express');
const authRouter = express.Router();
const { loginUser, logoutUser,register } = require("../controllers/auth.controller");
const { authenticateToken } = require("../middlewares/auth.middleWare")

// routes for login , logout and register new user
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/register',authenticateToken, register);


module.exports = authRouter;