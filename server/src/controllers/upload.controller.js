
const { connectDB, db } = require("../config/db.config");
const fileUploadSchema = require("../models/upload.model");

const uploadFile = async (req, res) => {
    try {
        await connectDB();
        console.log(req.body)

        if (!req.body.userId) {
            return res.status(400).json({ message: "No file userId" });
        }

        if (!req.body.file) {
            return res.status(400).json({ message: "No file 23uploaded" });
        }

        const { originalname, mimetype, buffer } = req.file;
        const userId = req.body.userId;

        // Validate with Zod
        const validatedData = fileUploadSchema.parse({
            userId,
            fileName: originalname,
            fileType: mimetype,
            fileBuffer: buffer,
        });

        // Save file details in MongoDB
        const fileCollection = db.collection("files");
        await fileCollection.insertOne(validatedData);

        return res.status(201).json({ message: "File uploaded successfully", file: validatedData });
    } catch (error) {
        console.error("File upload error:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadFile };