const { z } = require("zod");

const userSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must be at most 50 characters long" }),

    email: z.string()
        .email({ message: "Invalid email address" }),


    dob: z.date({ required_error: "Date of birth is required" }),

    joiningDate: z.date({ required_error: "Joining date is required" }),

    department: z.string({ required_error: "Department is required" }),

    empCode: z.string()
        .min(1, { message: "Employee Code is required" }),

    mobile: z.string()
        .regex(/^\d{10,15}$/, { message: "Phone number must be 10-15 digits" }).nullish(),
    password: z.string()
        .min(6, { message: "Password is required & must greater than 6 digits" }),
    isAdmin: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
    tokens: z.array(z.string()).optional()
}).strict(); // 🔹 This will reject extra fields


module.exports = userSchema;