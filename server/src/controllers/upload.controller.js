const { connectDB, db } = require("../config/db.config");
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
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileBuffer: req.file.buffer,
            uploadedAt: new Date()
        };

        console.log("File Data:", fileData); // Debugging

        // Save file to MongoDB
        const result = await filesCollection.insertOne(fileData);
        const result2 = await filesCollection.findOne({ _id: new ObjectId(result.insertedId) });
        // Convert buffer to Base64
        const base64Image = result2.fileBuffer.toString("base64");
        const mimeType = result2.fileType;
        res.status(201).json({ message: "File uploaded successfully", fileDetails: result2, imageUrl: `data:${mimeType};base64,${base64Image}` });

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
        const file = await filesCollection.findOne({ _id: new ObjectId(fileId) });
        if (!file) {
            return res.status(404).json({ message: "Image not found" });
        }
        // Convert buffer to Base64
        const base64Image = file.fileBuffer.toString("base64");
        const mimeType = file.fileType;
        return res.send({ imageUrl: `data:${mimeType};base64,${base64Image}` });
    } catch (error) {
        console.error("Image retrieval error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllImages = async (req, res) => {
    /*  #swagger.tags = ['Upload Image']
    */
    try {
        await connectDB();
        const images = await filesCollection.find().toArray();
        if (!images) {
            return res.status(404).json({ message: "no content" });
        }
        return res.status(200).json({ images, totalImages: images.length })
    } catch (error) {
    }
}

module.exports = { uploadFile, getImage, getAllImages };