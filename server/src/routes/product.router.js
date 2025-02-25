const express = require('express')
const productRouter = express.Router();
const { createProduct, validateCouponCode, getProductWithId, updateProduct, deleteProduct, getAllProducts } = require("../controllers/product.controller")
const { authenticateToken } = require("../middlewares/auth.middleWare")
    // routes for delete ,Create ,Update or getAll routes
    productRouter.post('/products', authenticateToken, createProduct),
    productRouter.get('/products', authenticateToken, getAllProducts),
    productRouter.put('/products/:id', authenticateToken, updateProduct),
    productRouter.get('/products/:id', authenticateToken, getProductWithId),
    productRouter.delete('/products/:id', authenticateToken, deleteProduct),
    

module.exports = productRouter