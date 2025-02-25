const express = require('express')
const uploadRouter = express.Router();
const { uploadImage } = require('../controllers/upload.controller')
const { authenticateToken } = require("../middlewares/auth.middleWare")
const upload = require("./../config/multer.config");

// routes for the upload image object seperately 
uploadRouter.post("/upload", authenticateToken, upload.single("file"), uploadImage);   // Upload a new image



// // bellow two routes are only for testing purpose
// uploadRouter.get("/images/:id", getImage);                        // Get a single image by ID
// uploadRouter.get("/images", getAllImages);                          // Get all images

module.exports = uploadRouter;