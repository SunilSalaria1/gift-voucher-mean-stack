const express = require('express');
const giftInventoryRouter = express.Router();
const { createUserPick, getGiftInvertory, deleteUserPick } = require("../controllers/giftInventory.controller");
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")
const { authenticateToken } = require("../middlewares/auth.middleWare")
giftInventoryRouter.put('/users/:id/gifts', authenticateToken, convertValuesToLowercase, createUserPick);
giftInventoryRouter.delete('/users/:id/gifts', authenticateToken, deleteUserPick);
giftInventoryRouter.get('/gifts', authenticateToken, getGiftInvertory); // Get all gift inventory

module.exports = giftInventoryRouter;