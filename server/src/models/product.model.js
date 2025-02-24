const { z } = require("zod");
const { ObjectId } = require('mongodb');
// Product Schema
const productSchema = z.object({
    couponCode: z.string().min(1, { message: "Coupon code is required" }),
    productImageId:  z.string()
    .refine((val) => ObjectId.isValid(val), { message: "Invalid MongoDB ObjectId" }) // Validate ObjectId
    .transform((val) => new ObjectId(val)), // Convert string to ObjectId
    productDescription: z.string().min(5, { message: "Product description should be at least 5 characters" }),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    productTitle: z.string().min(1, { message: "Product title is required" }),
    isDeleted: z.boolean().default(false),
    isActive: z.boolean().default(true)
});

module.exports = productSchema;
