const express = require('express');
const globalRouter = express.Router();
const userRouter = require("./user.router");
const authRouter = require("./auth.router");

globalRouter.use('/api', userRouter)
globalRouter.use('/api', authRouter)


module.exports = globalRouter;

