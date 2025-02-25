
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
    let empCode = `lpit${numericPart}`;

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
            return res.status(400).json({ errors: validation.error.format() }); //  Added return
        }
        // Check if email already exists
        const existingUser = await usersCollection.findOne({ email: req.body.email, isDeleted: false });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" }); //  Added return
        }

        const result = await usersCollection.insertOne(validation.data);
        const insertedDocument = await usersCollection.findOne({ _id: result.insertedId });
        return res.status(201).json({
            message: "User registered successfully", user: {
                _id: insertedDocument._id,
                name: insertedDocument.name,
                empCode: insertedDocument.empCode,
                password: insertedDocument.password
            }
        });

    } catch (e) {
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
};

const getUserWithId = async (req, res) => {
    /*  #swagger.tags = ['Users']
           #swagger.description = 'Get User with Id.' */
    try {
        await connectDB();
        const userId = req.params.id
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User Id" });
        }
        // Fetch the user from the database while excluding sensitive fields
        const userObject = await usersCollection.findOne(
            { _id: ObjectId.createFromHexString(userId) },
            { projection: { password: 0, tokens: 0, isDeleted: 0, isPicked: 0, productId: 0, lastUpdated: 0, createdAt: 0 } }
        );
        // Check if the user was found

        if (!userObject) {
            return res.status(404).json({ message: "User not found" });
        }

        res.send(userObject)

    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
};

const updateUser = async (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.description = 'Update User with Id.' 
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User update details',
            required: true,
            schema: { $ref: '#/definitions/updateUser' }
        }
        #swagger.responses[200] = { description: 'User updated successfully' }
        #swagger.responses[400] = { description: 'Invalid input' }
        #swagger.responses[404] = { description: 'User not found' }
        #swagger.responses[500] = { description: 'Internal server error' }
    */

    try {
        await connectDB();

        // Validate user ID
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Validate request body
        const { name, department } = req.body;

        // Validate using the picked schema
        const userUpdateSchema = userSchema.pick({ name: true, department: true });
        const validation = userUpdateSchema.safeParse({ name, department });
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() });
        }

        // Fetch user details
        const userDetails = await usersCollection.findOne({ _id: ObjectId.createFromHexString(userId) });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new employee code and hashed password if necessary
        const { empCode, hashedPassword } = await generateEmpCodeAndPassword(name, userDetails.email, department, userDetails.dob, usersCollection);

        // Update user in MongoDB
        const updatedUser = await usersCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(userId) },
            { $set: { name, department, empCode, password: hashedPassword, updatedAt: new Date() } },
            { returnDocument: "after" }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "Failed to update user" });
        }
        return res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error("MongoDB Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    /*  #swagger.tags = ['Users']
           #swagger.description = 'Get all users.' */
    try {
        await connectDB();
        // pagination 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;



        // flitering
        const filter = { isDeleted: false };
        if (req.query.role === "admin") {
            filter.isAdmin = true;
        }
        // Searching by name, email, empCode, department, joiningDate, or dob
        if (req.query.searchItem) {
            filter.$or = [
                {
                    name: { $regex: req.query.searchItem, $options: "i" }
                },
                {
                    email: { $regex: req.query.searchItem, $options: "i" }
                },
                {
                    empCode: { $regex: req.query.searchItem, $options: "i" }
                },
                {
                    department: { $regex: req.query.searchItem, $options: "i" }
                },
                {
                    joiningDate: { $regex: req.query.searchItem, $options: "i" }
                },
                {
                    dob: { $regex: req.query.searchItem, $options: "i" }
                },
            ]
        }

        // sorting   (default: ascending order)
        const sort = {};
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(":");
            sort[field] = order === 'desc' ? -1 : 1;
        }

        // Get total count (for pagination metadata)
        const totalUsers = await usersCollection.countDocuments(filter)

        // // Fetch paginated users while excluding sensitive fields
        const users = await usersCollection
            .find(filter)
            .project({ password: 0, tokens: 0, isDeleted: 0, isPicked: 0, productId: 0, lastUpdated: 0, createdAt: 0 }) // Exclude 'password' and 'tokens'
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray();
        return res.json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalUsers
        });
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
};

const deleteUserWithId = async (req, res) => {
    /*  #swagger.tags = ['Auth']
           #swagger.description = 'Delete User with Id .' */
    try {
        await connectDB();
        // Validate user ID format
        const userId = req.params.id
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User Id" });
        }
        // Check if user exists and is not deleted
        const userData = await usersCollection.findOne({ _id: ObjectId.createFromHexString(userId) }, { isDeleted: false })
        if (!userData) {
            return res.status(404).json({ message: "User not found" });

        }
        // Prevent deletion of Primary Admin
        if (userData.isPrimaryAdmin == true) {
            return res.status(403).json({ message: "You are not authorized to delete the Primary Admin" });
        }
        // Soft delete user by setting isDeleted to true
        const result = await usersCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(userId) },
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
};


module.exports = { register, getAllUsers, updateUser, deleteUserWithId, getUserWithId }