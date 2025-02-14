// const productSchema = require("../models/user.model");
// const { connectDB, db } = require('../config/db.config'); // Import db from db.js
// const { ObjectId } = require('mongodb');
// const multer = require("multer");
// const path = require("path");

// // Configure storage engine for Multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // Folder where files will be stored
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
//     },
// });

// // File filter to allow only certain file types (e.g., images)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|svg/; // Allowed file extensions
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         return cb(null, true);
//     } else {
//         cb(new Error("Only images (JPG, PNG) and PDFs are allowed"));
//     }
// };

// // Initialize Multer with settings
// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
// });

// // File upload controller function
// const uploadFile = async (req, res) => {
//     /*  #swagger.tags = ['File Upload']
//         #swagger.description = 'Upload a file'
//         #swagger.consumes = ['multipart/form-data']
//         #swagger.parameters['file'] = {
//             in: 'formData',
//             type: 'file',
//             required: true,
//             description: 'File to upload'
//         }
//         #swagger.responses[201] = {
//             description: 'File uploaded successfully',
//         }
//         #swagger.responses[400] = {
//             description: 'File upload error'
//         }
//     */
//     try {

//         upload.single("file")(req, res, (err) => {
//             if (err) {
//                 return res.status(400).json({ message: err.message });
//             }
//             if (!req.file) {
//                 return res.status(400).json({ message: "No file uploaded" });
//             }
//             res.status(201).json({
//                 message: "File uploaded successfully",
//                 filePath: `/uploads/${req.file.filename}`,
//             });
//         });
//     } catch (error) {
//         console.error("File upload error:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// module.exports = { uploadFile };