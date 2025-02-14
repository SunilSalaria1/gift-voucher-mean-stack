const { z } = require("zod");

// Product Schema
const productSchema = z.object({
    couponCode: z.string().min(1, { message: "Coupon code is required" }),
    productImg: z.string().min(1, { message: "Product image is required" }),
    productDescription: z.string().min(5, { message: "Product description should be at least 5 characters" }),
    addedAt: z.date().default(() => new Date()),
    productTitle: z.string().min(1, { message: "Product title is required" }),
});

module.exports = productSchema;
