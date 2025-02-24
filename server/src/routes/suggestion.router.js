const express = require('express')
const suggestionRouter = express.Router();
const { createSuggestion, getAllSuggestion } = require('../controllers/suggestion.controller')
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")
const { authenticateToken } = require("../middlewares/auth.middleWare")

suggestionRouter.post('/suggestion', authenticateToken, convertValuesToLowercase, createSuggestion);
suggestionRouter.get('/suggestion', authenticateToken, getAllSuggestion);

module.exports = suggestionRouter;