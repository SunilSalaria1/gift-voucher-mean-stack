const express = require('express');
const globalRouter = express.Router();
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const feedbackRouter = require("./feedback.router");

globalRouter.use('/api', userRouter)
globalRouter.use('/api', authRouter)
globalRouter.use('/api', feedbackRouter)


module.exports = globalRouter;

