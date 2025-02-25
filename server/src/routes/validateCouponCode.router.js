const express = require('express')
const validateCouponCodeRouter = express.Router();
const {  validateCouponCode } = require("../controllers/validateCouponCode.controller")
const { authenticateToken } = require("../middlewares/auth.middleWare")
// route checking the coupon code exists in our db or not  
validateCouponCodeRouter.get('/couponCode/:couponCode', authenticateToken, validateCouponCode)

module.exports = validateCouponCodeRouter