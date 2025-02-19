const express = require('express')
const feedbackRouter = express.Router();
const { addFeedback, getAllFeedbacks } = require('../controllers/feedBack.controller')
const { authenticateToken } = require("../middlewares/authMiddleWare")

feedbackRouter.post('/feedback', authenticateToken, addFeedback);
feedbackRouter.get('/feedback', authenticateToken, getAllFeedbacks);

module.exports = feedbackRouter;