const express = require('express')
const feedbackRouter = express.Router();
const { addFeedback, getAllFeedbacks } = require('../controllers/feedBack.controller')
const { authenticateToken } = require("../middlewares/authMiddleWare")

feedbackRouter.post('/addFeedback', addFeedback)
feedbackRouter.get('/getFeedbacks', getAllFeedbacks)

module.exports = feedbackRouter;