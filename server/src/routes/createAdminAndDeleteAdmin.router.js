const express = require('express');
const createAdminAndDeleteAdminRouter = express.Router();
const { createAdminAndDeleteAdmin } = require("../controllers/createAdminAndDeleteAdmin.controller");
const { authenticateToken } = require("../middlewares/auth.middleWare")

// routes for create Admin And Delete the admin
createAdminAndDeleteAdminRouter.put('/users/:id/role', authenticateToken, createAdminAndDeleteAdmin);

module.exports = createAdminAndDeleteAdminRouter;