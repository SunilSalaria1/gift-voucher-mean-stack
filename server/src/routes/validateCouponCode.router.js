const express = require('express')
const validateCouponCodeRouter = express.Router();
const {  validateCouponCode } = require("../controllers/validateCouponCode.controller")
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")
const { authenticateToken } = require("../middlewares/auth.middleWare")

validateCouponCodeRouter.get('/couponCode/:couponCode', authenticateToken,convertValuesToLowercase, validateCouponCode)

module.exports = validateCouponCodeRouter