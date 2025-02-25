const userSchema = require("../models/user.model");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ObjectId } = require('mongodb');
const productsCollection = db.collection('products');
const usersCollection = db.collection('users');

const selectUserGift = async (req, res) => {
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
        const userDetails = await usersCollection.findOne({ _id: ObjectId.createFromHexString(userId), isDeleted: false });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }
        // Validate request body using required schema fields
        const userGiftPickSchema = userSchema.pick({
            productId: true,
            isPicked: true
        });
        const validationResult = userGiftPickSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error.format() });
        }
        // Extract validated data
        const { productId, isPicked } = validationResult.data;
        // Validate `isPicked` value

        if (isPicked != "completed") {
            return res.status(400).json({ message: "Invalid isPicked value. Allowed values: 'completed'" });
        }

        // validating the productId is a valid object Id  or not 
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }
        // fetching the object by productId
        const productDetails = await productsCollection.findOne({ _id: (productId), isDeleted: false });
        // if product does not exists in following collection
        if (!productDetails) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update user in MongoDB
        const updatedUser = await usersCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(userId) },
            { $set: { productId, isPicked } },
            { returnDocument: "after" }
        );
        // if Failed to update user
        if (!updatedUser) {
            return res.status(404).json({ message: "Failed to select Gift" });
        }

        return res.status(200).json({ message: "User selected their gift  successfully", });

    } catch (error) {
        console.error("MongoDB Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteUserGift = async (req, res) => {
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
        const userDetails = await usersCollection.findOne({ _id: ObjectId.createFromHexString(userId), isDeleted: false });
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }


        // validating the req.query
        if (req.query.isPicked != "pending") {
            return res.status(400).json({ message: "Invalid isPicked value. Allowed values: 'pending'" });
        }

        // Update user in MongoDB
        const deletedUser = await usersCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(userId) },
            { $set: { productId: "", isPicked: req.query.isPicked } },
            { returnDocument: "after" }
        );
        // if failed to delete user
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
        // Filtering according to req.query.searchItem
        if (req.query.searchItem) {
            filter.$or = [
                { name: { $regex: req.query.searchItem, $options: "i" } },
                { empCode: { $regex: req.query.searchItem, $options: "i" } },
                { department: { $regex: req.query.searchItem, $options: "i" } },
                { isPicked: { $regex: req.query.searchItem, $options: "i" } },
                { "productDetails.couponCode": { $regex: req.query.searchItem, $options: "i" } },  // ✅ Fix
                { "productDetails.productTitle": { $regex: req.query.searchItem, $options: "i" } }       // ✅ Fix
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


            // Lookup product details (preserving unmatched users)
            {
                $lookup: {
                    from: 'products',
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
            { $match: filter },

            // Lookup product image details (preserving unmatched users)
            {
                $lookup: {
                    from: 'images',
                    localField: "productDetails.productImageId",
                    foreignField: "_id",
                    as: "productDetails.productImageDetails"
                }
            },
            { $unwind: { path: "$productDetails.productImageDetails", preserveNullAndEmptyArrays: true } },

            // Remove unwanted fields
            {
                $project: {
                    password: 0, email: 0, tokens: 0, isDeleted: 0, isAdmin: 0, isPrimaryAdmin: 0,
                    joiningDate: 0, dob: 0,
                    "productDetails.isDeleted": 0, "productDetails._id": 0,
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
            if (data.productDetails?.productImageDetails?.fileBuffer) {
                data.productDetails.imageUrl = `data:${data.productDetails.productImageDetails.fileType};base64,${data.productDetails.productImageDetails.fileBuffer.toString('base64')}`;
                // delete data.productDetails.productImageDetails.fileBuffer;
            }
            delete data.productDetails?.productImageDetails;
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

module.exports = { selectUserGift, getGiftInvertory, deleteUserGift }