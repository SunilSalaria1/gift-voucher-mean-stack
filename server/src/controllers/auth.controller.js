const userSchema = require("../models/user.model");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
const usersCollection = db.collection('users');
const SECRET_KEY = "Aniwer32432@#^%&^#!%@&#%&%!@#!&%@#!&@2153"
const bcrypt = require("bcryptjs");



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
        // Find the user by empCode
        const result = await usersCollection.findOne({ empCode: req.body.empCode });

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.body.role == "employee") {
            // 1. Check for the required empCode field in request body
            if (!req.body.empCode) {
                return res.status(400).json({ message: "Missing required fields: Employee Code" });
            }
            // 2. If the user is not an admin, proceed with login (admin check can be handled differently)
            if (result.isAdmin === false) {
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
                        department: result.department
                    },
                    token: token,
                });
            }
        }
        else if (req.body.role == "admin") {
            if (result.isAdmin == false) {
                return res.status(401).json({ message: "Sorry are not a admin :)" });
            }
            // 3. Check for missing password
            if (!req.body.password || !req.body.empCode) {
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
                        department: result.department
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
       #swagger.parameters['body'] = {
           in: 'body',
           description: 'User logout credentials',
           required: true,
           schema: { $ref: '#/definitions/logoutUser' }
       }
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


module.exports = { loginUser, logoutUser }