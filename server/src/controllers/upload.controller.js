
const { connectDB, db } = require("../config/db.config");
const fileUploadSchema = require("../models/upload.model");
const filesCollection = db.collection('files');
const { ObjectId } = require('mongodb');
const uploadFile = async (req, res) => {
    /*  #swagger.tags = ['Upload Image']
     */
    try {
        await connectDB();

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Extract file details
        const fileData = {
            userId: req.body.userId,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileBuffer: req.file.buffer,
            uploadedAt: new Date()
        };

        console.log("File Data:", fileData); // Debugging

        // Save file to MongoDB
        const result = await filesCollection.insertOne(fileData);
        const result2 = await filesCollection.findOne({ _id: new ObjectId(result.insertedId) });
        res.status(201).json({ message: "File uploaded successfully", fileId: result.insertedId, fileDetails: result2 });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const getImage = async (req, res) => {
     /*  #swagger.tags = ['Upload Image']
     */
    try {
        await connectDB();
        const fileId = req.params.id;
        const file =  await filesCollection.findOne({ _id: new ObjectId(fileId) });

        if (!file) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.setHeader("Content-Type", file.fileType); // Set the correct MIME type
        res.send(file.fileBuffer); // Send the image data

    } catch (error) {
        console.error("Image retrieval error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { uploadFile, getImage };