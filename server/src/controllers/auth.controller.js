const userSchema = require("../models/user.model");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb');
const usersCollection = db.collection('users');
const SECRET_KEY = "Aniwer32432@#^%&^#!%@&#%&%!@#!&%@#!&@2153"
const bcrypt = require("bcryptjs");
const loginUser = async (req, res) => {
    /*  #swagger.tags = ['Auth']
                #swagger.description = 'Register user'
                #swagger.parameters['body'] = {
                in: 'body',
                description: 'User registration details',
                required: true,
                schema: { $ref: '#/definitions/loginUser' }
                }
                #swagger.responses[201] = {
                description: 'User Created successfully',
                }
                #swagger.responses[404] = {
                description: 'Invalid credentials'
                }
                */
    // console.log("11111111111started//////////")
    try {
        await connectDB();
        if (!req.body.empCode) {
            return res.status(400).json({ message: "Missing required fields: Employee Code" });
        }
        // Find the user by empCode
        const result = await usersCollection.findOne({ empCode: req.body.empCode });
        if (!result) {
            return res.status(404).json({ message: "User not found12" });
        }
        if (result.isAdmin === false) {
            const token = await jwt.sign({ userId: result._id.toString() }, SECRET_KEY, { expiresIn: "1h" });
            const updatedDataToken = await usersCollection.updateOne(
                { _id: result._id },
                { $push: { tokens: token } }, { returnDocument: 'after' } // Add the token to the tokens array
            );
            console.log("After JWT Sign", token);
            res.header("authorizaton", token)
            res.status(200).json({
                message: "Employee Login  successful",
                userId: result._id, // Returning user ID
                token, updatedDataToken
            });
        } else {
            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(req.body.password, result.password);
            if (isPasswordValid) {
                console.log("Before JWT Sign");
                const token = await jwt.sign({ userId: result._id.toString() }, SECRET_KEY, { expiresIn: "1h" });
                const updatedDataToken = await usersCollection.updateOne(
                    { _id: result._id },
                    { $push: { tokens: token } }, { returnDocument: 'after' } // Add the token to the tokens array
                );
                console.log("After JWT Sign", token);
                res.header("authorizaton", token)
                res.status(200).json({
                    message: "Admin Login successful",
                    userId: result._id, // Returning user ID
                    token, updatedDataToken
                });
            } else {
                return res.status(401).json({ message: "Invalid credentials" });
            }
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: e.message
        });
    }
};


const logoutUser = async (req, res) => {
    try {
        const { token } = req.body; // Get the token from the request body
        if (!token) {
            return res.status(400).json({ message: "Token is required for logout" });
        }

        // Find the user by token
        const result = await usersCollection.findOne({ tokens: token });
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove the token from the user's tokens array
        await usersCollection.updateOne(
            { _id: result._id },
            { $pull: { tokens: token } } // Removes the specific token from the array
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