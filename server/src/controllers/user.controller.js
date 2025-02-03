
const userSchema = require("../models/user.model");
const { ZodError } = require("zod");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ObjectId } = require('mongodb');

const usersCollection = db.collection('users');
const crypto = require('crypto');

const generateEmpCode = async (name, email, department, usersCollection) => {
    // Create a base string using name, email, department, and current timestamp for uniqueness
    const baseString = `${name}${email}${department}${Date.now()}`;
    // Generate a hash of the base string using SHA-256
    const hash = crypto.createHash('sha256');
    hash.update(baseString);
    // Convert the hash to a hex string, then take the first 8 characters (numeric part)
    let numericPart = hash.digest('hex').slice(0, 8); // Take first 8 characters of the hash
    // Ensure numeric part is a valid number (use hex digits only)
    numericPart = parseInt(numericPart, 16).toString().slice(0, 8); // Convert to number, keep the first 8 digits
    // Final employee code with 'Lp' prefix (Total 10 characters: 'Lp' + 8 digits)
    let empCode = `LPIT${numericPart}`;
    // Step 2: Ensure the code is unique by checking if it already exists in the database
    const existingEmpCode = await usersCollection.findOne({ empCode });
    if (existingEmpCode) {
        // If code exists, regenerate with new timestamp or random number
        return generateEmpCode(name, email, department, usersCollection);
    }
    return empCode;
};


const register = async (req, res) => {
    /*  #swagger.tags = ['Auth']
                #swagger.description = 'Register user'
                #swagger.parameters['body'] = {
                in: 'body',
                description: 'User registration details',
                required: true,
                schema: { $ref: '#/definitions/registerUser' }
                }
                #swagger.responses[201] = {
                description: 'User Created successfully',
                }
                #swagger.responses[404] = {
                description: 'Invalid credentials'
                }
                */
    try {
        await connectDB();
        // Step 1: Generate empCode
        const { name, email, department } = req.body;
        const empCode = await generateEmpCode(name, email, department, usersCollection);

        // Step 2: Add generated empCode to req.body
        req.body.empCode = empCode;
        // Convert `dob` and `joiningDate` from string to Date
        const parsedBody = {
            ...req.body,
            dob: req.body.dob ? new Date(req.body.dob) : undefined,
            joiningDate: req.body.joiningDate ? new Date(req.body.joiningDate) : undefined
        };
        // Validate request body
        const validation = userSchema.safeParse(parsedBody);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() }); // 🔹 Added return
        }
        // Check if email already exists
        const existingUser = await usersCollection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" }); // 🔹 Added return
        }
        // Insert user into MongoDB
        const result = await usersCollection.insertOne(validation.data);
        return res.status(201).json({ message: "User registered successfully", userId: result.insertedId });

    } catch (e) {
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
};


const getUserWithId = async (req, res) => {
    /*  #swagger.tags = ['Users']
           #swagger.description = 'Get User with Id .' */
    try {
        await connectDB();
        const userId = req.params.id
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User Id" });
        }
        const userObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
        // const users = await usersCollection.find().toArray();
        res.send(userObject)
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
}

const updateUser = async (req, res) => {
    /*  #swagger.tags = ['Auth']
               #swagger.description = 'Delete User with Id .' 
               #swagger.parameters['body'] = {
                in: 'body',
                description: 'User registration details',
                required: true,
                schema: { $ref: '#/definitions/updateUser' }
                }
                #swagger.responses[201] = {
                description: 'User Created successfully',
                }
                #swagger.responses[404] = {
                description: 'Invalid credentials'
                }
                */
    try {
        await connectDB();
        // Check if userId is present and valid
        const userId = req.params.id;
        if (!ObjectId.isValid(userId) || !userId) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        // Validate only `name` and `department` fields
        const updateUserSchema = userSchema.pick({
            name: true,
            department: true,
        });
        if (!req.body.name || !req.body.department) {
            return res.status(400).json({ message: "Missing required fields: name and department" });
        }
        // Validate request body using Zod (if applicable)
        const validation = updateUserSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() });
        }
        // Update user in MongoDB
        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { name: req.body.name, department: req.body.department } },
            { returnDocument: 'after' }
        );
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User updated successfully", updateUser: result });

    } catch (e) {
        console.error("MongoDB Error:", e);
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
};



const getAllUsers = async (req, res) => {
    /*  #swagger.tags = ['Users']
           #swagger.description = 'Get all users.' */
    try {
        await connectDB();
        const users = await usersCollection.find().toArray();;

        res.send(users)
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
}


const deleteUserWithId = async (req, res) => {
    /*  #swagger.tags = ['Auth']
           #swagger.description = 'Delete User with Id .' */
    try {
        await connectDB();
        const userId = req.params.id
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User Id" });
        }
        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { isDeleted: true } },
            { returnDocument: 'after' }
        );
        return res.status(200).json({ message: "User deleted successfully", deletedUser: result });
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
}

module.exports = { register, getAllUsers, updateUser, deleteUserWithId, getUserWithId }