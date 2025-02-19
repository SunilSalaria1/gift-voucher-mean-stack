const express = require('express')
const productRouter = express.Router();
const { addProduct, getCouponCode, getProductWithId, updateProduct, deleteProduct, getAllProducts } = require("../controllers/product.controller")
const { authenticateToken } = require("../middlewares/authMiddleWare")
productRouter.post('/products', authenticateToken, addProduct),
    productRouter.get('/products', authenticateToken, getAllProducts),
    productRouter.put('/products/:id', authenticateToken, updateProduct),
    productRouter.get('/products/:id', authenticateToken, getProductWithId),
    productRouter.delete('/products/:id', authenticateToken, deleteProduct),
    productRouter.get('/couponCode/:couponCode', authenticateToken, getCouponCode)

module.exports = productRouter