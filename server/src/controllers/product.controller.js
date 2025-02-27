const productSchema = require("../models/product.model");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ObjectId } = require('mongodb');
const { ZodError } = require("zod");
const productsCollection = db.collection('products');
const usersCollection = db.collection('users');
const suggestionCollection = db.collection('suggestions');

const createProduct = async (req, res) => {
    /*  #swagger.tags = ['Products']
                #swagger.description = 'Add Product'
                #swagger.parameters['body'] = {
                in: 'body',
                description: 'Product details',
                required: true,
                schema: { $ref: '#/definitions/addProduct' }
                }
                #swagger.responses[201] = {
                description: 'Product Added successfully',
                }
                */
    try {
        await connectDB();
        // validating the req.body for Product Schema
        const validation = productSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() }); // 🔹 Added return
        }
        // Check coupon code if aleady exists then return.
        const result1 = await productsCollection.find({ couponCode: validation.data.couponCode, isDeleted: false }).toArray();
        if (result1.length > 0) {
            return res.status(401).json({ message: "Coupon code already exist" });
        }
        // creating a new product using insertOne 
        const result = await productsCollection.insertOne(validation.data);
        // fetching the inserted object
        const insertedDocument = await productsCollection.findOne({ _id: result.insertedId });
        return res.status(201).json({
            message: "Product created successfully", user: {
                _id: insertedDocument._id,
                couponCode: insertedDocument.couponCode,
                productImageId: insertedDocument.productImageId,
                productDescription: insertedDocument.productDescription,
                productTitle: insertedDocument.productTitle
            }
        });
    } catch (e) {
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
};

const getProductWithId = async (req, res) => {
    /*  #swagger.tags = ['Products']
           #swagger.description = 'Get Product with Id .' */
    try {
        await connectDB();

        const productId = req.params.id;

        // Validate Product Id
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product Id" });
        }
        // Define the filter to find the product
        const filter = { _id: ObjectId.createFromHexString(productId), isDeleted: false, isActive: true };

        // Aggregate to join product with images collection
        const product = await productsCollection.aggregate([
            { $match: filter }, // Apply filtering

            {
                $lookup: {
                    from: 'images', // Join with the 'images' collection
                    localField: 'productImageId', // The field in products collection that holds the file _id
                    foreignField: '_id', // The field in images collection that corresponds to the productImage _id
                    as: 'productImageDetails' // The alias for the joined data
                }
            },
            { $unwind: "$productImageDetails" }, // Unwind the array to get a single image
            {
                $project: {

                    "productImageDetails.isDeleted": 0 // Remove isDeleted from productImageDetails
                }
            }
        ]).toArray();

        // Check if the product is found
        if (product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Convert buffer to Base64 and add imageUrl
        const productObj = product[0]; // Since we expect only one product with the provided ID
        if (productObj.productImageDetails && productObj.productImageDetails.fileBuffer) {
            // Convert the fileBuffer to Base64
            const base64Image = productObj.productImageDetails.fileBuffer.toString('base64');
            // Add the Base64 string as a new field in the image details
            productObj.productImageDetails.imageUrl = `data:${productObj.productImageDetails.fileType};base64,${base64Image}`;
            delete productObj.productImageDetails.fileBuffer;

            delete productObj.isDeleted;
            delete productObj.isActive;
            delete productObj.addedAt;
            delete productObj.updatedAt;
            delete productObj.productImageDetails.fileType;
            delete productObj.productImageDetails.uploadedAt;
        }

        return res.json(productObj);

    } catch (e) {
        console.log(e);
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message });
        }
        res.status(500).json({ message: e.message });
    }
};

const updateProduct = async (req, res) => {
    /*  #swagger.tags = ['Products']
                #swagger.description = 'Add Product'
                #swagger.parameters['body'] = {
                in: 'body',
                description: 'User registration details',
                required: true,
                schema: { $ref: '#/definitions/UpdateProduct' }
                }
                #swagger.responses[201] = {
                description: 'Product Updated successfully',
                }
                */
    try {
        await connectDB();
        // validating user Id
        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        // validating the req.body for Product Schema
        const validation = productSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() }); // 🔹 Added return
        }

        // Fetch user details
        const productDetails = await productsCollection.findOne({ _id: ObjectId.createFromHexString(productId), couponCode: req.body.couponCode });

        // if not geting productDetails 
        if (!productDetails) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Update user in MongoDB
        const updatedProduct = await productsCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(productId) },
            { $set: { productImageId: ObjectId.createFromHexString(req.body.productImageId), productDescription: req.body.productDescription, productTitle: req.body.productTitle } },
            { returnDocument: "after" }
        );

        // Failed to update Product
        if (!updatedProduct) {
            return res.status(404).json({ message: "Failed to update Product" });
        }
        return res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        console.error("MongoDB Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    /*  #swagger.tags = ['Products']
           #swagger.description = 'Delete User with Id .' */
    try {
        await connectDB();
        // validate product ID
        const productId = req.params.id
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product Id" });
        }
        // fetching object by productId 
        const result = await productsCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(productId) },
            { $set: { isDeleted: true } },
            { returnDocument: 'after' }
        );
        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully", });
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
};

const getAllProducts = async (req, res) => {
    /*  #swagger.tags = ['Products']
           #swagger.description = 'Get all Products.' */
    try {
        await connectDB();

        // Check if pagination is provided in the request
        const isPaginationProvided = req.query.page !== undefined && req.query.limit !== undefined;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        // Filtering
        const filter = { isDeleted: false, isActive: true };

        if (req.query.searchItem &&
            typeof req.query.searchItem === 'string' &&
            req.query.searchItem !== '[object Object]') {
            filter.$or = [
                { couponCode: { $regex: req.query.searchItem, $options: "i" } },
                { productDescription: { $regex: req.query.searchItem, $options: "i" } },
                { productTitle: { $regex: req.query.searchItem, $options: "i" } }
            ];
        }

        // Sorting
        const sort = {};
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(":");
            sort[field] = order === 'desc' ? -1 : 1;
        }
        const sortStage = req.query.sortBy ? [{ $sort: sort }] : [];

        // Aggregation pipeline
        const aggregationPipeline = [

            { $match: filter }, // Apply filtering

            {
                $lookup: {
                    from: 'images', // Join with the 'images' collection
                    localField: 'productImageId', // The field in products collection that holds the file _id
                    foreignField: '_id', // The field in images collection that corresponds to the productImage _id
                    as: 'productImageDetails' // The alias for the joined data
                }
            },
            { $unwind: "$productImageDetails" } // Unwind the array to get a single image
        ];


        // Apply sorting if specified
        if (sortStage.length) {
            aggregationPipeline.push(...sortStage);
        }

        // Apply pagination only if pagination parameters were provided
        if (isPaginationProvided) {
            aggregationPipeline.push({ $skip: skip }, { $limit: limit });
        }
        // Fetch products
        const products = await productsCollection.aggregate(aggregationPipeline).toArray();

        const getAllUsersWhoPicked = await usersCollection.find({ isPicked: "completed", isDeleted: false }).toArray();
        const totalPickedUsersCount = await usersCollection.countDocuments({ isPicked: "completed", isDeleted: false })

        // Convert buffer to Base64 and add imageUrl
        products.forEach(product => {
            if (product.productImageDetails && product.productImageDetails.fileBuffer) {
                // Convert the fileBuffer to Base64
                const base64Image = product.productImageDetails.fileBuffer.toString('base64');
                // Add the Base64 string as a new field in the image details
                product.productImageDetails.imageUrl = `data:${product.productImageDetails.fileType};base64,${base64Image}`;
                delete product.productImageDetails.fileBuffer;
                delete product.productImageDetails.fileType;
                delete product.productImageDetails.uploadedAt;

                delete product.isDeleted;
                delete product.addedAt;
                delete product.isActive;
                delete product.updatedAt;
                delete product.createdAt;
                // Initialize pickedCount if it's undefined or null
                if (!product.pickedCount) {
                    product.pickedCount = 0;
                }
                getAllUsersWhoPicked.forEach(element => {
                    console.log(product._id)
                    if (element.productId.toString() === product._id.toString()) {

                        product.pickedCount += 1
                    }
                });
                product.pickedCountPercentage = totalPickedUsersCount > 0
                    ? parseFloat((product.pickedCount / totalPickedUsersCount * 100).toFixed(1)).toString().replace(/\.0$/, "")
                    : 0;
            }
        });
        // Get total count for pagination
        const totalProducts = await productsCollection.countDocuments({ isDeleted: false, isActive: true });
        const totalUsers = await usersCollection.countDocuments({ isDeleted: false });
        const usersPickedGift = await usersCollection.countDocuments({ isDeleted: false, isPicked: "completed" });
        const userDidNotPickedGift = totalUsers - usersPickedGift;
        const totalSuggestions = await suggestionCollection.countDocuments({ isDeleted: false, });

        // If pagination was not provided, return all products in a separate response
        if (!isPaginationProvided) {
            return res.json({ products, totalProducts, totalUsers, usersPickedGift, userDidNotPickedGift, totalSuggestions });
        }

        // Return paginated response
        return res.json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            totalProducts
        });
    } catch (e) {
        console.log(e);
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message });
        }
        res.status(500).json({ message: e.message });
    }
};

module.exports = { createProduct, getProductWithId, updateProduct, deleteProduct, getAllProducts };