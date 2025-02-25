
const { ZodError } = require("zod");
const userSchema = require("../models/user.model");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ObjectId } = require('mongodb');
const usersCollection = db.collection('users');


const createAdminAndDeleteAdmin = async (req, res) => {
    /*  #swagger.tags = ['Admin']
        #swagger.description = 'Update User with Id.' 
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Admin Creation details',
            required: true,
            schema: { $ref: '#/definitions/createAdmin' }
        }
        #swagger.responses[200] = { description: 'Admin Created successfully' }
        #swagger.responses[400] = { description: 'Invalid input' }
        #swagger.responses[404] = { description: 'User not found' }
        #swagger.responses[500] = { description: 'Internal server error' }
    */

    try {
        await connectDB();
        // Validate user ID format
        const userId = req.params.id
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User Id" });
        }
        const { isAdmin } = req.body;
        const userGiftPickSchema = userSchema.pick({
            isAdmin: true
        });
        // Validate request body using existing schema
        const validationResult = userGiftPickSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error.format() });
        }

        // if (!isAdmin) {
        //     return res.status(400).json({ message: " isAdmin is missing" });
        // }

        // // Find the user by ID
        const user = await usersCollection.findOne(
            { _id: ObjectId.createFromHexString(userId) })
        if (user.isPrimaryAdmin == true) {
            return res.status(401).json({ message: "Unauthorised Access" });
        }
        if (isAdmin == 'true') {

            const result = await usersCollection.findOneAndUpdate(
                { _id: ObjectId.createFromHexString(userId) },
                { $set: { isAdmin: true } },
                { returnDocument: "after" }
            );
            // Check if update was successful
            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "Admin Created successfully", admin: result });
        } else {
            const result = await usersCollection.findOneAndUpdate(
                { _id: ObjectId.createFromHexString(userId) },
                { $set: { isAdmin: false } },
                { returnDocument: "after" }
            );

            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "Admin deleted successfully" });
        }
    } catch (e) {
        console.log(e);
        // Handle validation errors
        if (e instanceof ZodError) {
            return res.status(400).json({ message: e.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {createAdminAndDeleteAdmin}