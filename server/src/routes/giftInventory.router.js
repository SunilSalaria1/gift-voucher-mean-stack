const express = require('express');
const giftInventoryRouter = express.Router();
const { selectUserGift, getGiftInvertory, deleteUserGift } = require("../controllers/giftInventory.controller");
const { authenticateToken } = require("../middlewares/auth.middleWare")

// routes for get all gigts picked by all users and select Gift And unselect gift
giftInventoryRouter.put('/users/:id/gifts', authenticateToken, selectUserGift);
giftInventoryRouter.delete('/users/:id/gifts', authenticateToken, deleteUserGift);
giftInventoryRouter.get('/gifts', authenticateToken, getGiftInvertory);           // Get all gift inventory

module.exports = giftInventoryRouter;