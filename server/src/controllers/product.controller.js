const productSchema = require("../models/product.model");
const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ObjectId } = require('mongodb');
const productsCollection = db.collection('products');
const addProduct = async (req, res) => {
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





        const requiredFields = ["couponCode", "productImg", "productDescription", "productTitle"];
        const receivedFields = Object.keys(req.body);

        // Check for missing fields
        const missingFields = requiredFields.filter(field => !receivedFields.includes(field));

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        const validation = productSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.format() }); // 🔹 Added return
        }


        const result = await productsCollection.insertOne(validation.data);
        const insertedDocument = await productsCollection.findOne({ _id: result.insertedId });
        return res.status(201).json({
            message: "Product added successfully", user: {
                _id: insertedDocument._id,
                couponCode: insertedDocument.couponCode,
                productImg: insertedDocument.productImg,
                productDescription: insertedDocument.productDescription,
                productTitle: insertedDocument.productTitle
            }
        });

    } catch (e) {
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
};

const getCouponCode = async (req, res) => {
    /*  #swagger.tags = ['Products']
           #swagger.description = 'Get Coupon Code .' */
    try {
        await connectDB();
        const code = req.params.couponCode
        if (!code) {
            return res.status(400).json({ message: "Coupon code is required" });
        }

        const productObj = await productsCollection.findOne({ couponCode: code });
        // const users = await usersCollection.find().toArray();
        if (productObj) {
            return res.send(true)
        }
        return res.send(false)
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
}

const getProductWithId = async (req, res) => {
    /*  #swagger.tags = ['Products']
           #swagger.description = 'Get Product with Id .' */
    try {
        await connectDB();
        const productId = req.params.id
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product Id" });
        }
        const productObj = await productsCollection.findOne({ _id: new ObjectId(productId) });
        res.send(productObj)
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
}


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
        // Validate user ID
        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }
        // Fetch user details
        const productDetails = await productsCollection.findOne({ _id: new ObjectId(productId) });
        if (!productDetails) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Validate request body


        const { couponCode, productImg, productDescription, productTitle } = req.body;
        if (!couponCode || !productImg || !productDescription || !productTitle) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // Update user in MongoDB
        const updatedProduct = await productsCollection.findOneAndUpdate(
            { _id: new ObjectId(productId) },
            { $set: { productImg, productDescription, productTitle } },
            { returnDocument: "after" }
        );

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
        const productId = req.params.id
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product Id" });
        }
        const result = await productsCollection.findOneAndUpdate(
            { _id: new ObjectId(productId) },
            { $set: { isDeleted: true } },
            { returnDocument: 'after' }
        );
        return res.status(200).json({ message: "Product deleted successfully", deletedProduct: result });
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
}


const getAllProducts = async (req, res) => {
    /*  #swagger.tags = ['Products']
           #swagger.description = 'Get all Products.' */
    try {
        await connectDB();
        // pagination 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;



        // flitering
        const filter = { isDeleted: false };
        // console.log("req.query.rolereq.query.role", typeof (req.query.role))
        // if (req.query.role === "admin") {
        //     filter.isAdmin = true;
        // }

        if (req.query.searchItem) {
            filter.$or = [
                {
                    couponCode: { $regex: req.query.searchItem, $options: "i" }
                },
                {
                    productDescription: { $regex: req.query.searchItem, $options: "i" }
                },
                {
                    productTitle: { $regex: req.query.searchItem, $options: "i" }
                }
            ]
        }

        // sorting 
        const sort = {};
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(":");
            sort[field] = order === 'desc' ? -1 : 1;
        }

        // Get total count (for pagination metadata)
        const totalProducts = await productsCollection.countDocuments(filter)

        // Fetch paginated users
        const products = await productsCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray()
        return res.json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            totalProducts
        });
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
}

module.exports = { addProduct, getCouponCode, getProductWithId, updateProduct, deleteProduct, getAllProducts };