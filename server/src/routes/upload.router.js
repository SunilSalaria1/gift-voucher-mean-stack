const express = require('express')
const uploadRouter = express.Router();
const { uploadFile } = require('../controllers/upload.controller')
// const { authenticateToken } = require("../middlewares/authMiddleWare")

uploadRouter.post('/upload', uploadFile);


module.exports = uploadRouter;