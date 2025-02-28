const { z } = require("zod");
const { ObjectId } = require('mongodb');
const userSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must be at most 50 characters long" }),

    email: z.string()
        .email({ message: "Invalid email address" }),
    // dob: z.date({ required_error: "Date of birth is required" }),
    // joiningDate: z.date({ required_error: "Joining date is required" }),

    department: z.string({ required_error: "Department is required" }),
    dob: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date({ required_error: "Date of birth is required" })),

    joiningDate: z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date({ required_error: "Joining date is required" })),
    employeeCode: z.string()
        .min(1, { message: "Employee Code is required" }),
    password: z.string()
        .min(6, { message: "Password is required & must greater than 6 digits" }),
    isAdmin: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
    tokens: z.array(z.string()).optional(),
    isPrimaryAdmin: z.boolean().default(false),
    isPicked: z.string()
        .default("pending")
        .refine(val => val === "completed" || val === "pending", {
            message: "Invalid isPicked value. Allowed values: 'completed', 'pending'",
        }),
    productId: z.string()
        .default("null") // Default value as "null"
        .refine((val) => val === "null" || ObjectId.isValid(val), { message: "Invalid MongoDB ObjectId" }) // Validate ObjectId when not "null"
        .transform((val) => (val === "null" ? val : new ObjectId(val))), // Convert to ObjectId unless default
    updatedAt: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date()),
    createdAt: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date()),
}).strict(); //  This will reject extra fields





module.exports = userSchema;