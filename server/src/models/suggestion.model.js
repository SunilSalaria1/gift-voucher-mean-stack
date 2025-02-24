const { z } = require("zod");

// Feedback Schema
const suggestionSchema = z.object({
    userId: z.string().min(1, "User ID is required"), // Reference to user schema
    description: z.string().min(5, "Description should be at least 5 characters"),
    createdAt: z.date().default(() => new Date()), // Timestamp for feedback
    updatedAt: z.date().default(() => new Date()), // Timestamp for feedback
    isDeleted: z.boolean().default(false)
});

module.exports = suggestionSchema;