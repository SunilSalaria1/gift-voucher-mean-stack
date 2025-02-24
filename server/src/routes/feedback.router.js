const express = require('express')
const feedbackRouter = express.Router();
const { addFeedback, getAllFeedbacks } = require('../controllers/feedBack.controller')
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")
const { authenticateToken } = require("../middlewares/auth.middleWare")

feedbackRouter.post('/feedback', authenticateToken, convertValuesToLowercase, addFeedback);
feedbackRouter.get('/feedback', authenticateToken, getAllFeedbacks);

module.exports = feedbackRouter;