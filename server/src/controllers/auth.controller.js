const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const jwt = require('jsonwebtoken')
const usersCollection = db.collection('users');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY
const bcrypt = require("bcryptjs");
const userSchema = require("../models/user.model");
const { generateEmpCodeAndPassword } = require("../utility/utils")


const loginUser = async (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.description = 'Login user'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'User login credentials',
            required: true,
            schema: { $ref: '#/definitions/loginUser' }
        }
        #swagger.responses[201] = {
            description: 'Login successful',
        }
        #swagger.responses[400] = {
            description: 'Missing required fields or Invalid credentials'
        }
        #swagger.responses[401] = {
            description: 'Invalid credentials'
        }
    */
    try {
        await connectDB();
        // Find the user by employeeCode
        const result = await usersCollection.findOne({ employeeCode: req.body.employeeCode, isDeleted: false });

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.body.role == "employee") {
            // 1. Check for the required employeeCode field in request body
            if (!req.body.employeeCode) {
                return res.status(400).json({ message: "Missing required fields: Employee Code" });
            }
            // 2. If the user is not an admin, proceed with login (admin check can be handled differently)
            // Generate JWT token for non-admin user
            const token = await jwt.sign({ userId: result._id.toString() }, SECRET_KEY, { expiresIn: "1h" });
            const updatedDataToken = await usersCollection.updateOne(
                { _id: result._id },
                { $push: { tokens: token } },
                { returnDocument: 'after' } // Add the token to the tokens array
            );
            return res.status(200).json({
                message: "Employee Login successful",
                userDetails: {
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    isAdmin: result.isAdmin,
                    department: result.department,
                    isPicked: result.isPicked,
                    productId: result.productId,
                    role: "employee",

                },
                token: token,
            });

        }
        else if (req.body.role == "admin") {
            if (result.isAdmin == false) {
                return res.status(401).json({ message: "Sorry are not a admin :)" });
            }
            // 3. Check for missing password
            if (!req.body.password || !req.body.employeeCode) {
                return res.status(400).json({ message: "Missing required fields: Password or Empcode" });
            }

            // 4. Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(req.body.password, result.password);

            if (isPasswordValid) {
                // Generate JWT token for the admin user
                const token = await jwt.sign({ userId: result._id.toString() }, SECRET_KEY, { expiresIn: "1h" });
                await usersCollection.updateOne(
                    { _id: result._id },
                    { $push: { tokens: token } },
                    { returnDocument: 'after' } // Add the token to the tokens array
                );
                return res.status(200).json({
                    message: "Admin Login successful",
                    userDetails: {
                        _id: result._id,
                        name: result.name,
                        email: result.email,
                        isAdmin: result.isAdmin,
                        department: result.department,
                        role: "admin"
                    },
                    token: token,
                });
            } else {
                // 5. If password is invalid, return an error message
                return res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            return res.status(401).json({ message: "Invalid role" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: e.message
        });
    }
};

const logoutUser = async (req, res) => {
    /*  #swagger.tags = ['Auth']
       #swagger.description = 'Logout user'
       
       #swagger.responses[201] = {
           description: 'Logout successful',
       }
       #swagger.responses[400] = {
           description: 'Missing token or Invalid token'
       }
       #swagger.responses[401] = {
           description: 'Invalid token'
       }
   */
    try {
        await connectDB();
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ message: "Token is required for logout" });
        }
        const token = authHeader.split(" ")[1]; // Extract token
        // Find the user by token
        const result = await usersCollection.findOne({ tokens: token });
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        // Remove the token from the user's tokens array
        await usersCollection.updateOne(
            { _id: result._id },
            { $pull: { tokens: token } }
        );
        return res.status(200).json({ message: "Logout successful" });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: e.message
        });
    }
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
        // Step 1: Generate employeeCode
        let { name, email, department, dob } = req.body;
        req.body.name = name.trim().toLowerCase();
        req.body.email = email.trim().toLowerCase();
        const { employeeCode, hashedPassword } = await generateEmpCodeAndPassword(name, email, department, dob, usersCollection);


        // Step 2: Add generated employeeCode to req.body
        req.body.employeeCode = employeeCode;
        req.body.password = hashedPassword;


        // Validate request body
        const validation = userSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() }); //  Added return
        }
        // Check if email already exists
        const existingUser = await usersCollection.findOne({ email: req.body.email, isDeleted: false });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" }); //  Added return
        }
        // inserting the req.body object in DB usersCollection
        const result = await usersCollection.insertOne(validation.data);
        const insertedDocument = await usersCollection.findOne({ _id: result.insertedId });
        return res.status(201).json({
            message: "User registered successfully", user: {
                _id: insertedDocument._id,
                name: insertedDocument.name,
                employeeCode: insertedDocument.employeeCode,
                password: insertedDocument.password
            }
        });

    } catch (e) {
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
};


module.exports = { loginUser, logoutUser, register }