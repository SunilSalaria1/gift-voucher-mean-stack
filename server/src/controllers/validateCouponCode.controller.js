const { connectDB, db } = require('../config/db.config'); // Import db from db.js
const { ZodError } = require("zod");
const productsCollection = db.collection('products');

const validateCouponCode = async (req, res) => {
    /*  #swagger.tags = ['Products']
           #swagger.description = 'Get Coupon Code .'*/
    try {
        await connectDB();
        // validate coupon code
        const code = req.params.couponCode
        if (!code) {
            return res.status(400).json({ message: "Coupon code is required" });
        }
        // fetching the existing coupon code 
        const productObj = await productsCollection.findOne({ couponCode: code, isDeleted: false });
        // if exists then send true
        if (productObj) {
            return res.send(true)
        }
        // if not then send false
        return res.send(false)
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            res.status(400).json({ message: e.message })
        }
        res.status(500).json({ message: e.message })
    }
};

module.exports = { validateCouponCode }