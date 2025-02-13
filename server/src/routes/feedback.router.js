const express = require('express')
const feedbackRouter = express.Router();
const { addFeedback } = require('../controllers/feedBack.controller')
const { authenticateToken } = require("../middlewares/authMiddleWare")

feedbackRouter.post('/addFeedback', addFeedback)

module.exports = feedbackRouter;