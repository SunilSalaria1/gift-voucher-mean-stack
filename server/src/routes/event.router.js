const express = require('express');
const eventRouter = express.Router();
const { createEvent, updateEventById, deleteEventById, getEventById, getAllEvents } = require('../controllers/event.controller');
const authRouter = require('./auth.router');
// routes for the create, delete and update events
eventRouter.post("/events", createEvent);
eventRouter.put("/events/:id", updateEventById);
eventRouter.delete("/events/:id", deleteEventById);
eventRouter.get("/events/:id", getEventById);
eventRouter.get("/events", getAllEvents);

module.exports = eventRouter