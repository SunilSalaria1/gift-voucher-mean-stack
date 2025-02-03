const userSchema = require("../models/user.model");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb');
const usersCollection = db.collection('users');
const SECRET_KEY = "Aniwer32432@#^%&^#!%@&#%&%!@#!&%@#!&@2153"
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
    console.log("11111111111started//////////")
    try {
        await connectDB();
        if (!req.body.empCode) {
            return res.status(400).json({ message: "Missing required fields: Employee Code" })
        }
        const result = await usersCollection.findOne({ empCode: req.body.empCode })
        console.log("222222222222!!!!!!!!!!!!!!!!!!!!!!!!!!!", result)
        if (!result) {
            return res.status(404).json({ message: "User not found" })
        }
        console.log("33333333333!!!!!!!!!!!!!!!!!!!!!!!!!!!", result._id)
        console.log("Before JWT Sign");
        const token = await jwt.sign({ userId: result._id.toString() }, SECRET_KEY, { expiresIn: "1h" });
        console.log("After JWT Sign", token);
        res.status(200).json({
            message: "Login successful",
            userId: result._id, // Returning user ID
            token
        });

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: e.message
        });
    }
}

module.exports = { loginUser }