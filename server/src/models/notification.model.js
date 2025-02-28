const { z } = require("zod");
const { ObjectId } = require('mongodb');

// Notification Schema
const notificationSchema = z.object({
    message: z.string().min(5, { message: "Event description should be at least 5 characters" }),
    eventId: z.string()
        .refine((val) => ObjectId.isValid(val), { message: "Invalid MongoDB ObjectId" }) // Validate ObjectId
        .transform((val) => new ObjectId(val)), // Convert string to ObjectId
    updatedAt: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date()),
    createdAt: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date()),
    isDeleted: z.boolean().default(false),
    readBy:z.array(z.string()).optional()
}).strict();
module.exports = notificationSchema;