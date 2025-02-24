const express = require('express');
const authRouter = express.Router();
const { loginUser, logoutUser } = require("../controllers/auth.controller");
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")

authRouter.post('/login',convertValuesToLowercase, loginUser);
authRouter.post('/logout', logoutUser);

module.exports = authRouter;