const express = require('express');
const { getAllNotifications, markAsRead } = require('../controllers/notification.controller');
const notificationRouter = express.Router();
const { authenticateToken } = require("../middlewares/auth.middleWare");

notificationRouter.get("/notifications", authenticateToken, getAllNotifications);
notificationRouter.put("/notifications/:id", authenticateToken, markAsRead);

module.exports = notificationRouter