const express = require('express');
const authRouter = express.Router();
const { loginUser } = require("../controllers/auth.controller");

authRouter.post('/loginUser', loginUser);


module.exports = authRouter;