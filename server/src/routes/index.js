const express = require('express');
const globalRouter = express.Router();
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const uploadRouter = require("./upload.router");
const suggestionRouter = require("./suggestion.router");
const productRouter = require("./product.router");
const giftInventoryRouter = require("./giftInventory.router");

globalRouter.use('/api', userRouter)
globalRouter.use('/api', authRouter)
globalRouter.use('/api', suggestionRouter)
globalRouter.use('/api', uploadRouter)
globalRouter.use('/api', productRouter)
globalRouter.use('/api', giftInventoryRouter)

module.exports = globalRouter;

