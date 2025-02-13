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

const getAllFeedbacks = async (req, res) => {
    /*  #swagger.tags = ['Feedback section']

               */
    try {
        await connectDB();
        // const useriddata = await feedbackCollection.find().toArray()
        const feedbacks = await feedbackCollection.aggregate([{
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
                localField: "userIdObj",           // userId in feedback collection
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
                "userDetails.isPrimaryAdmin": 0
            }
        }
        ]).toArray();
        return res.status(200).json({ feedbacks })


    } catch (e) {
        console.error("Error fetching feedbacks:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// const getAllFeedbacks = async (req, res) => {
//     try {
//         await connectDB();
//         const feedbacks = await feedbackCollection.aggregate([
//             {
//                 $addFields: {
//                     userIdObj: {
//                         $cond: {
//                             if: { $eq: [{ $strLenCP: "$userId" }, 24] }, // Check if userId is 24 characters long
//                             then: { $toObjectId: "$userId" },  // Convert valid userId to ObjectId
//                             else: null  // Set null if invalid
//                         }
//                     }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "userIdObj",  // Use converted ObjectId
//                     foreignField: "_id",
//                     as: "userDetails"
//                 }
//             },
//             {
//                 $match: { "userDetails": { $ne: [] } }  // Remove feedbacks with no valid user match
//             },
//             {
//                 $unwind: "$userDetails"
//             },
//             {
//                 $project: {
//                     "userDetails.password": 0,
//                     "userDetails.tokens": 0,
//                     "userDetails.isDeleted": 0,
//                     "userDetails.isAdmin": 0,
//                     "userDetails.isPrimaryAdmin": 0
//                 }
//             }
//         ]).toArray();

//         return res.status(200).json({ feedbacks });

//     } catch (e) {
//         console.error("Error fetching feedbacks:", e);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };


module.exports = { addFeedback, getAllFeedbacks }