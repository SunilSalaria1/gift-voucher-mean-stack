const express = require('express')
const uploadRouter = express.Router();
const { uploadFile, getImage } = require('../controllers/upload.controller')
// const { authenticateToken } = require("../middlewares/authMiddleWare")
const upload = require("./../middlewares/multer.config");

uploadRouter.post("/upload", upload.single("file"), uploadFile);
uploadRouter.get("/image/:id", upload.single("file"), getImage);


module.exports = uploadRouter;