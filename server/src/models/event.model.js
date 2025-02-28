const { z } = require("zod");
const { ObjectId } = require('mongodb');
// Event Schema
const eventSchema = z.object({
    title: z.string().min(3, { message: "Event Title should be at least 3 characters" }),
    about: z.string().min(5, { message: "Event about should be at least 5 characters" }),
    
    imageId: z.string()
        .refine((val) => ObjectId.isValid(val), { message: "Invalid MongoDB ObjectId" }) // Validate ObjectId
        .transform((val) => new ObjectId(val)), // Convert string to ObjectId
    address: z.string().min(5, { message: "Event address should be at least 5 characters" }),
    date: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date({ required_error: "Event Date is required" })),
    time: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, {
                        message: "Invalid time format (hh:mm AM/PM required)"
                    }),
    note:z.string().optional(),
    whyYouAttend:z.string().optional(),
    isDeleted: z.boolean().default(false),
    isActive: z.boolean().default(true),
    updatedAt: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date()),
    createdAt: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date())

}).strict();

module.exports = eventSchema;