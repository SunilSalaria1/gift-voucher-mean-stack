const express = require('express');
const authRouter = express.Router();
const { loginUser, logoutUser,register } = require("../controllers/auth.controller");
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")

// routes for login , logout and register new user
authRouter.post('/login',convertValuesToLowercase, loginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/users', convertValuesToLowercase, register);


module.exports = authRouter;