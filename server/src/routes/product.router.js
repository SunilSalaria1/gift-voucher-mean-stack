const express = require('express')
const productRouter = express.Router();
const { createProduct, validateCouponCode, getProductWithId, updateProduct, deleteProduct, getAllProducts } = require("../controllers/product.controller")
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")
const { authenticateToken } = require("../middlewares/auth.middleWare")

    productRouter.post('/products', authenticateToken,convertValuesToLowercase, createProduct),
    productRouter.get('/products', authenticateToken, getAllProducts),
    productRouter.put('/products/:id', authenticateToken,convertValuesToLowercase, updateProduct),
    productRouter.get('/products/:id', authenticateToken, getProductWithId),
    productRouter.delete('/products/:id', authenticateToken, deleteProduct),
    

module.exports = productRouter