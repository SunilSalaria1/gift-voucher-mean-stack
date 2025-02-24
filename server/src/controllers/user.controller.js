
const userSchema = require("../models/user.model");
const { ZodError } = require("zod");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ObjectId } = require('mongodb');
const usersCollection = db.collection('users');
const productsCollection = db.collection('products');
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
        const requiredFields = ["name", "department", "email", "dob", "joiningDate"];
        const receivedFields = Object.keys(req.body);

        // Check for missing fields
        const missingFields = requiredFields.filter(field => !receivedFields.includes(field));

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }
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
        const existingUser = await usersCollection.findOne({ email: req.body.email }, { isDeleted: false });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" }); // 🔹 Added return
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
        const userObject = await usersCollection.findOne(
            { _id: new ObjectId(userId) },
            { projection: { password: 0, tokens: 0, isDeleted: 0, isPicked: 0, productId: 0, lastUpdated: 0, createdAt: 0 } }
        );

        // const users = await usersCollection.find().toArray();
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
        // Fetch user details
        const userDetails = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }
        // Validate request body
        const { name, department, email, dob } = req.body;
        if (!name || !department) {
            return res.status(400).json({ message: "Missing required fields: name and department" });
        }

        // Generate new employee code and hashed password if necessary
        const { empCode, hashedPassword } = await generateEmpCodeAndPassword(name, email, department, dob, usersCollection);

        // Update user in MongoDB
        const updatedUser = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { name, department, empCode, password: hashedPassword, lastUpdated: new Date() } },
            { returnDocument: "after" }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "Failed to update user" });
        }
        return res.status(200).json({ message: "User updated successfully" });
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

        // sorting 
        const sort = {};
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(":");
            sort[field] = order === 'desc' ? -1 : 1;
        }

        // Get total count (for pagination metadata)
        const totalUsers = await usersCollection.countDocuments(filter)

        // Fetch paginated users
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
        const userId = req.params.id
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User Id" });
        }
        const userData = await usersCollection.findOne({ _id: new ObjectId(userId) }, { isDeleted: false })
        if (!userData) {
            return res.status(404).json({ message: "User not found" });

        }

        if (userData.isPrimaryAdmin == true) {
            return res.status(403).json({ message: "You are not authorized to delete the Primary Admin" });
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
};

const createAdmin = async (req, res) => {
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

        const { id, isAdmin } = req.body;

        if (!id || !isAdmin) {
            return res.status(400).json({ message: "Id or isAdmin is missing" });
        }

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid User Id" });
        }
        const user = await usersCollection.findOne(
            { _id: new ObjectId(id) })
        if (user.isPrimaryAdmin == true) {
            return res.status(401).json({ message: "Unauthorised Access" });
        }
        if (isAdmin == 'true') {
            const result = await usersCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { isAdmin: true } },
                { returnDocument: "after" }
            );

            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "Admin Created successfully", admin: result });
        } else {
            const result = await usersCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
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
        if (e instanceof ZodError) {
            return res.status(400).json({ message: e.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateUserPick = async (req, res) => {
    /*  #swagger.tags = ['Gifts']
        #swagger.description = 'Update User Gift Pick with Id.' 
        // #swagger.parameters['body'] = {
        //     in: 'body',
        //     description: 'User update details',
        //     required: true,
        //     schema: { $ref: '#/definitions/UpdateUserGiftPick' }
        // }
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
        // Fetch user details
        const userDetails = await usersCollection.findOne({ _id: new ObjectId(userId), isDeleted: false });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }


        const { productId, isPicked } = req.body;
        if (!productId || !isPicked) {
            return res.status(400).json({ message: "Missing required fields: productId and isPicked" });
        }
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }
        const productDetails = await productsCollection.findOne({ _id: new ObjectId(productId), isDeleted: false });
        if (!productDetails) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update user in MongoDB
        const updatedUser = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { productId, isPicked: true } },
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

const deleteUserPick = async (req, res) => {
    /*  #swagger.tags = ['Gifts']
        #swagger.description = 'Delete User Gift Pick with Id.' 

    */
    try {
        await connectDB();
        // Validate user ID
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        // Fetch user details
        const userDetails = await usersCollection.findOne({ _id: new ObjectId(userId), isDeleted: false });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }



        if (!req.query.isPicked) {
            return res.status(400).json({ message: "Missing required field: isPicked" });
        }

        // Update user in MongoDB
        const deletedUser = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { productId: "", isPicked: false } },
            { returnDocument: "after" }
        );

        if (!deletedUser) {
            return res.status(404).json({ message: "Failed to delete user" });
        }

        return res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("MongoDB Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getGiftInvertory = async (req, res) => {
    /*  #swagger.tags = ['Gifts']
        #swagger.description = 'All Users Gift Pick.' 
    */
    try {
        await connectDB();

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filtering
        const filter = { isDeleted: false };
        if (req.query.role === "admin") {
            filter.isAdmin = true;
        }

        if (req.query.searchItem) {
            filter.$or = [
                { name: { $regex: req.query.searchItem, $options: "i" } },
                { empCode: { $regex: req.query.searchItem, $options: "i" } },
                { department: { $regex: req.query.searchItem, $options: "i" } },
                { "productDetails?.couponCode": { $regex: req.query.searchItem, $options: "i" } },
                { "productDetails?.title": { $regex: req.query.searchItem, $options: "i" } }
            ];
        }

        // Sorting
        const sort = {};
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(":");
            sort[field] = order === 'desc' ? -1 : 1;
        }
        const sortStage = req.query.sortBy ? [{ $sort: sort }] : [];

        // Aggregation
        const giftInventoryData = await usersCollection.aggregate([
            { $match: filter },

            // Convert productId to ObjectId only if it's a valid string
            {
                $addFields: {
                    productObjId: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ifNull: ["$productId", false] },  // Ensure it exists
                                    { $ne: ["$productId", ""] },  // Ignore empty strings
                                    { $eq: [{ $type: "$productId" }, "string"] },  // Ensure it's a string
                                    { $eq: [{ $strLenCP: "$productId" }, 24] }  // Ensure valid ObjectId length
                                ]
                            },
                            then: { $toObjectId: "$productId" },
                            else: null
                        }
                    }
                }
            },

            // Lookup product details (preserving unmatched users)
            {
                $lookup: {
                    from: 'products',
                    localField: "productObjId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },

            // Convert productImg to ObjectId only if it's a valid string
            {
                $addFields: {
                    productImgObjId: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ifNull: ["$productDetails.productImg", false] },  // Ensure it exists
                                    { $ne: ["$productDetails.productImg", ""] },  // Ignore empty strings
                                    { $eq: [{ $type: "$productDetails.productImg" }, "string"] },  // Ensure it's a string
                                    { $eq: [{ $strLenCP: "$productDetails.productImg" }, 24] }  // Ensure valid ObjectId length
                                ]
                            },
                            then: { $toObjectId: "$productDetails.productImg" },
                            else: null
                        }
                    }
                }
            },

            // Lookup product image details (preserving unmatched users)
            {
                $lookup: {
                    from: 'files',
                    localField: "productImgObjId",
                    foreignField: "_id",
                    as: "productDetails.productImgDetails"
                }
            },
            { $unwind: { path: "$productDetails.productImgDetails", preserveNullAndEmptyArrays: true } },

            // Remove unwanted fields
            {
                $project: {
                    password: 0, email: 0, tokens: 0, isDeleted: 0, isAdmin: 0, isPrimaryAdmin: 0,
                    joiningDate: 0, dob: 0, productObjId: 0, productImgObjId: 0,
                    "productDetails.isDeleted": 0, "productDetails._id": 0, "productDetails.productImg": 0,
                    "productDetails.productDescription": 0, "productDetails.addedAt": 0
                }
            },
            // Sorting
            ...(Object.keys(sort).length > 0 ? [{ $sort: sort }] : []),

            // Pagination (Skip and Limit)
            { $skip: skip },
            { $limit: limit }

        ]).toArray();

        // Ensure users without product details still appear
        giftInventoryData.forEach(data => {
            if (data.productDetails?.productImgDetails?.fileBuffer) {
                data.productDetails.imageUrl = `data:${data.productDetails.productImgDetails.fileType};base64,${data.productDetails.productImgDetails.fileBuffer.toString('base64')}`;
                delete data.productDetails.productImgDetails.fileBuffer;
            }
            delete data.productDetails?.productImgDetails;
        });

        // Total counts for pagination
        const totalUsers = await usersCollection.countDocuments({ isDeleted: false });
        const totalProducts = await productsCollection.countDocuments({ isDeleted: false, isActive: true });
        const usersPickedGift = await usersCollection.countDocuments({ isDeleted: false, isPicked: true });
        const userDidNotPickedGift = totalUsers - usersPickedGift;

        return res.json({
            giftInventoryData,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalUsers, totalProducts,
            usersPickedGift,
            userDidNotPickedGift
        });

    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = { register, getAllUsers, updateUser, deleteUserWithId, getUserWithId, createAdmin, updateUserPick, getGiftInvertory, deleteUserPick }