const { z } = require("zod");
const { ObjectId } = require('mongodb');
// Feedback Schema
const suggestionSchema = z.object({
    userId:  z.string()
        .refine((val) => ObjectId.isValid(val), { message: "Invalid MongoDB ObjectId" }) // Validate ObjectId
        .transform((val) => new ObjectId(val)), // Convert string to ObjectId
    description: z.string().min(5, "Description should be at least 5 characters"),
    createdAt: z.date().default(() => new Date()), // Timestamp for feedback
    updatedAt: z.date().default(() => new Date()), // Timestamp for feedback
    isDeleted: z.boolean().default(false)
});

module.exports = suggestionSchema;