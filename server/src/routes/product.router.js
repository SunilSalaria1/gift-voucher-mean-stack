const express = require('express')
const productRouter = express.Router();
const { addProduct, getCouponCode, getProductWithId, updateProduct, deleteProduct, getAllProducts } = require("../controllers/product.controller")

productRouter.post('/products', addProduct),
    productRouter.get('/products', getAllProducts),
    productRouter.put('/products/:id', updateProduct),
    productRouter.get('/products/:id', getProductWithId),
    productRouter.delete('/products/:id', deleteProduct),
    productRouter.get('/couponCode/:couponCode', getCouponCode)

module.exports = productRouter