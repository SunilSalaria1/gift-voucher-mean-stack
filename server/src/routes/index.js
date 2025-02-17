const express = require('express');
const globalRouter = express.Router();
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const uploadRouter = require("./upload.router");
const feedbackRouter = require("./feedback.router");
const productRouter = require("./product.router");


globalRouter.use('/api', userRouter)
globalRouter.use('/api', authRouter)
globalRouter.use('/api', feedbackRouter)
globalRouter.use('/api', uploadRouter)
globalRouter.use('/api', productRouter)


module.exports = globalRouter;

