const express = require('express')
const uploadRouter = express.Router();
const { uploadFile, getImage, getAllImages } = require('../controllers/upload.controller')
const { authenticateToken } = require("../middlewares/authMiddleWare")
const upload = require("./../middlewares/multer.config");

uploadRouter.post("/upload", authenticateToken, upload.single("file"), uploadFile);   // Upload a new image
uploadRouter.get("/images/:id", authenticateToken, getImage);                        // Get a single image by ID
uploadRouter.get("/images", getAllImages);                          // Get all images

module.exports = uploadRouter;