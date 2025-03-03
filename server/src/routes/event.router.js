const express = require('express');
const eventRouter = express.Router();
const { createEvent, updateEventById, deleteEventById, getEventById, getAllEvents } = require('../controllers/event.controller');
const { authenticateToken } = require("../middlewares/auth.middleWare");

// routes for the create, delete and update events

eventRouter.post("/events", authenticateToken, createEvent);
eventRouter.put("/events/:id",authenticateToken, updateEventById);
eventRouter.delete("/events/:id",authenticateToken, deleteEventById);
eventRouter.get("/events/:id",authenticateToken, getEventById);
eventRouter.get("/events", authenticateToken,getAllEvents);

module.exports = eventRouter