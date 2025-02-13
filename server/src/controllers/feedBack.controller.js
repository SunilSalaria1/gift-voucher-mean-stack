const feedbackSchema = require("../models/feedback.model");
const { ZodError } = require("zod");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ObjectId } = require('mongodb');

const feedbackCollection = db.collection('feedback');

const addFeedback = async (req, res) => {
    /*  #swagger.tags = ['Feedback section']
               
               */
    try {
        await connectDB();
        const { userId, rating, description } = req.body
        if (!userId || !rating || !description) {
            return res.status(400).json({ message: 'Missing required fields:' })
        }
        const validation = feedbackSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() })
        }
        const feedback = await feedbackCollection.insertOne(validation.data);
        const insertedDocument = await feedbackCollection.findOne({ _id: feedback.insertedId });
        return res.status(201).json({
            message: "Feedback sent successflly", feedback: insertedDocument
        });
    } catch (e) {
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
};


module.exports = { addFeedback }