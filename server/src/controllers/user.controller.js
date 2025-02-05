
const userSchema = require("../models/user.model");
const { ZodError } = require("zod");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ObjectId } = require('mongodb');

const usersCollection = db.collection('users');
const crypto = require('crypto');

const bcrypt = require("bcryptjs");

const generateEmpCodeAndPassword = async (name, email, department, dob, usersCollection) => {
    // Generate Employee Code
    const baseString = `${name}${email}${department}${Date.now()}`;
    const hash = crypto.createHash("sha256");
    hash.update(baseString);
    let numericPart = hash.digest("hex").slice(0, 8);
    numericPart = parseInt(numericPart, 16).toString().slice(0, 8);
    let empCode = `LPIT${numericPart}`;

    // Ensure uniqueness in DB
    const existingEmpCode = await usersCollection.findOne({ empCode });
    if (existingEmpCode) {
        return generateEmpCodeAndPassword(name, email, department, dob, usersCollection);
    }

    // Generate Default Password
    const namePart = name.slice(0, 3).toLowerCase(); // First 3 letters of name
    const dobPart = new Date(dob).toLocaleDateString("en-GB").split("/").join(""); // DDMMYY format
    const defaultPassword = `${namePart}${dobPart}`;
    console.log(defaultPassword)

    // 🔹 Hash the password using bcryptjs
    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(defaultPassword, salt); // Hash password
    // console.log("###################################", hashedPassword)
    // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", empCode)
    return { empCode, hashedPassword };
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
        const { name, email, department, dob } = req.body;
        const { empCode, hashedPassword } = await generateEmpCodeAndPassword(name, email, department, dob, usersCollection);


        // Step 2: Add generated empCode to req.body
        req.body.empCode = empCode;
        req.body.password = hashedPassword;
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