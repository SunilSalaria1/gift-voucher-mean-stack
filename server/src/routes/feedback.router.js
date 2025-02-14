const express = require('express')
const feedbackRouter = express.Router();
const { addFeedback, getAllFeedbacks } = require('../controllers/feedBack.controller')
const { authenticateToken } = require("../middlewares/authMiddleWare")

feedbackRouter.post('/feedback', addFeedback);
feedbackRouter.get('/feedback', getAllFeedbacks);

module.exports = feedbackRouter;