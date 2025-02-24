
const { ZodError } = require("zod");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ObjectId } = require('mongodb');
const suggestionSchema = require("../models/suggestion.model");
const suggestionCollection = db.collection('suggestions');

const createSuggestion = async (req, res) => {
    /*  #swagger.tags = ['Suggestion section']
               */
    try {
        await connectDB();
        const { userId, description } = req.body
        // Validate user ID
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User Id" })
        }

        // Validate request body
        const validation = suggestionSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() })
        }
        // Inserting a suggestion
        const suggestion = await suggestionCollection.insertOne(validation.data);
        // Fetching inserted Object
        const insertedDocument = await suggestionCollection.findOne({ _id: suggestion.insertedId });
        return res.status(201).json({
            message: "Suggestion sent successflly", suggestion: insertedDocument
        });
    } catch (e) {
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
};

const getAllSuggestions = async (req, res) => {
    /*  #swagger.tags = ['Suggestion section']
               */
    try {
        await connectDB();
        const suggestions = await suggestionCollection.aggregate([
            { $match: { isDeleted: false } },
            {
                $addFields: {
                    userIdObj: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$userId" }, 24] }, // Check if userId is 24 characters long
                            then: { $toObjectId: "$userId" },  // Convert valid userId to ObjectId
                            else: null  // Set null if invalid
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",              // Join with users collection
                    localField: "userIdObj",           // userId in suggestion collection
                    foreignField: "_id",            // _id in users collection
                    as: "userDetails"           // Store result in 'userDetails'
                }
            },
            {
                $unwind: "$userDetails"             // Convert userDetails array into object
            },
            {
                $project: {
                    "userDetails.password": 0,
                    "userDetails.tokens": 0,
                    "userDetails.isDeleted": 0,
                    "userDetails.isAdmin": 0,
                    "userDetails.isPrimaryAdmin": 0,
                    "userDetails._id": 0,
                    "userDetails.joiningDate": 0,
                    "userDetails.dob": 0,
                    "userIdObj": 0

                }
            }
        ]).toArray();
        // returning all Suggestions
        return res.status(200).json({ suggestions })
    } catch (e) {
        console.error("Error fetching Suggestions:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { createSuggestion, getAllSuggestions }