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
        const existingCouponCode = await productsCollection.findOne({ couponCode: req.body.couponCode });
        if (existingCouponCode) {
            return res.status(400).json({ error: "Coupon code already exists" }); // 🔹 Added return
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
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", code)
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

// const getProductWithId = async (req, res) => {
//     /*  #swagger.tags = ['Products']
//            #swagger.description = 'Get Product with Id .' */
//     try {
//         await connectDB();
//         const productId = req.params.id;

//         // Validate Product Id
//         if (!ObjectId.isValid(productId)) {
//             return res.status(400).json({ message: "Invalid Product Id" });
//         }

//         // Define the filter to find the product
//         const filter = { _id: new ObjectId(productId), isDeleted: false };

//         // Aggregate to join product with files collection
//         const product = await productsCollection.aggregate([
//             { $match: filter }, // Apply filtering
//             {
//                 $addFields: {
//                     productObjId: {
//                         $cond: {
//                             if: { $eq: [{ $strLenCP: "$productImg" }, 24] }, // Check if productImg is a valid ObjectId
//                             then: { $toObjectId: "$productImg" }, // Convert to ObjectId
//                             else: null // Set null if invalid
//                         }
//                     }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'files', // Join with the 'files' collection
//                     localField: 'productObjId', // The field in products collection that holds the file _id
//                     foreignField: '_id', // The field in files collection that corresponds to the productImg _id
//                     as: 'productImageDetails' // The alias for the joined data
//                 }
//             },
//             { $unwind: "$productImageDetails" }, // Unwind the array to get a single image
//             {
//                 $project: {
//                     "productImageDetails.productObjId": 0,
//                     "productImageDetails.isDeleted": 0
//                 }
//             }
//         ]).toArray();

//         // Check if the product is found
//         if (product.length === 0) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         // Convert buffer to Base64 and add imageUrl
//         const productObj = product[0]; // Since we expect only one product with the provided ID
//         if (productObj.productImageDetails && productObj.productImageDetails.fileBuffer) {
//             // Convert the fileBuffer to Base64
//             const base64Image = productObj.productImageDetails.fileBuffer.toString('base64');
//             // Add the Base64 string as a new field in the image details
//             productObj.productImageDetails.imageUrl = `data:${productObj.productImageDetails.fileType};base64,${base64Image}`;
//             delete productObj.productImageDetails.fileBuffer;
//         }

//         return res.json(productObj);

//     } catch (e) {
//         console.log(e);
//         if (e instanceof ZodError) {
//             res.status(400).json({ message: e.message });
//         }
//         res.status(500).json({ message: e.message });
//     }
// };
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
        const filter = { _id: new ObjectId(productId), isDeleted: false };

        // Aggregate to join product with files collection
        const product = await productsCollection.aggregate([
            { $match: filter }, // Apply filtering
            {
                $addFields: {
                    productObjId: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$productImg" }, 24] }, // Check if productImg is a valid ObjectId
                            then: { $toObjectId: "$productImg" }, // Convert to ObjectId
                            else: null // Set null if invalid
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'files', // Join with the 'files' collection
                    localField: 'productObjId', // The field in products collection that holds the file _id
                    foreignField: '_id', // The field in files collection that corresponds to the productImg _id
                    as: 'productImageDetails' // The alias for the joined data
                }
            },
            { $unwind: "$productImageDetails" }, // Unwind the array to get a single image
            {
                $project: {
                    "productImageDetails.productObjId": 0, // Remove productObjId from productImageDetails
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
            delete productObj.productObjId;
            delete productObj.isDeleted;
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
        // Validate user ID
        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }
        // Fetch user details
        const productDetails = await productsCollection.findOne({ _id: new ObjectId(productId), couponCode: req.body.couponCode });

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

// const getAllProducts = async (req, res) => {
//     /*  #swagger.tags = ['Products']
//            #swagger.description = 'Get all Products.' */
//     try {
//         await connectDB();
//         // pagination 
//         const isPaginationProvided = req.query.page !== undefined && req.query.limit !== undefined;

//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         // flitering
//         const filter = { isDeleted: false };

//         if (req.query.searchItem) {
//             filter.$or = [
//                 {
//                     couponCode: { $regex: req.query.searchItem, $options: "i" }
//                 },
//                 {
//                     productDescription: { $regex: req.query.searchItem, $options: "i" }
//                 },
//                 {
//                     productTitle: { $regex: req.query.searchItem, $options: "i" }
//                 }
//             ]
//         }

//         // sorting 
//         const sort = {};
//         if (req.query.sortBy) {
//             const [field, order] = req.query.sortBy.split(":");
//             sort[field] = order === 'desc' ? -1 : 1;
//         }
//         const sortStage = req.query.sortBy ? [{ $sort: sort }] : [];

//         // Aggregate to join products with files collection
//         const products = await productsCollection.aggregate([
//             { $match: filter }, // Apply filtering
//             {
//                 $addFields: {
//                     productObjId: {
//                         $cond: {
//                             if: { $eq: [{ $strLenCP: "$productImg" }, 24] }, // Check if userId is 24 characters long
//                             then: { $toObjectId: "$productImg" },  // Convert valid userId to ObjectId
//                             else: null  // Set null if invalid
//                         }
//                     } // Add the entire image object from files collection
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'files', // Join with the 'files' collection
//                     localField: 'productObjId', // The field in products collection that holds the file _id
//                     foreignField: '_id', // The field in files collection that corresponds to the productImg _id
//                     as: 'productImageDetails' // The alias for the joined data
//                 }
//             },
//             { $unwind: "$productImageDetails" }, // Unwind the array to get a single image

//             { $skip: skip }, // Pagination skip
//             { $limit: limit }, // Pagination limit
//             ...sortStage, // Only if sorting is applied
//         ]).toArray();

//         // Convert buffer to Base64 and add imageUrl
//         products.forEach(product => {
//             if (product.productImageDetails && product.productImageDetails.fileBuffer) {
//                 // Convert the fileBuffer to Base64
//                 const base64Image = product.productImageDetails.fileBuffer.toString('base64');
//                 // Add the Base64 string as a new field in the image details
//                 product.productImageDetails.imageUrl = `data:${product.productImageDetails.fileType};base64,${base64Image}`;
//                 delete product.productImageDetails.fileBuffer;
//                 delete product.productObjId;
//                 delete product.isDeleted;
//             }
//         });

//         // Get total count for pagination
//         const totalProducts = await productsCollection.countDocuments(filter);

//         return res.json({
//             products,
//             totalPages: Math.ceil(totalProducts / limit),
//             currentPage: page,
//             totalProducts
//         });

//     } catch (e) {
//         console.log(e);
//         if (e instanceof ZodError) {
//             res.status(400).json({ message: e.message });
//         }
//         res.status(500).json({ message: e.message });
//     }
// };
const getAllProducts = async (req, res) => {
    /*  #swagger.tags = ['Products']
           #swagger.description = 'Get all Products.' */
    try {
        await connectDB();

        // Check if pagination is provided in the request
        const isPaginationProvided = req.query.page !== undefined && req.query.limit !== undefined;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filtering
        const filter = { isDeleted: false };

        if (req.query.searchItem) {
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
                $addFields: {
                    productObjId: {
                        $cond: {
                            if: { $eq: [{ $strLenCP: "$productImg" }, 24] }, // Check if productImg is a valid ObjectId
                            then: { $toObjectId: "$productImg" }, // Convert to ObjectId
                            else: null // Set null if invalid
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'files', // Join with the 'files' collection
                    localField: 'productObjId', // The field in products collection that holds the file _id
                    foreignField: '_id', // The field in files collection that corresponds to the productImg _id
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

        // Convert buffer to Base64 and add imageUrl
        products.forEach(product => {
            if (product.productImageDetails && product.productImageDetails.fileBuffer) {
                // Convert the fileBuffer to Base64
                const base64Image = product.productImageDetails.fileBuffer.toString('base64');
                // Add the Base64 string as a new field in the image details
                product.productImageDetails.imageUrl = `data:${product.productImageDetails.fileType};base64,${base64Image}`;
                delete product.productImageDetails.fileBuffer;
                delete product.productObjId;
                delete product.isDeleted;
            }
        });

        // Get total count for pagination
        const totalProducts = await productsCollection.countDocuments(filter);

        // If pagination was not provided, return all products in a separate response
        if (!isPaginationProvided) {
            return res.json({ products,totalProducts });
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











module.exports = { addProduct, getCouponCode, getProductWithId, updateProduct, deleteProduct, getAllProducts };