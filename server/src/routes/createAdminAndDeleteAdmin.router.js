const express = require('express');
const createAdminAndDeleteAdminRouter = express.Router();
const { createAdminAndDeleteAdmin } = require("../controllers/createAdminAndDeleteAdmin.controller");
const { convertValuesToLowercase } = require("../middlewares/convertValuesToLowercase.middleWare")
const { authenticateToken } = require("../middlewares/auth.middleWare")
// routes for create Admin And Delete the admin
createAdminAndDeleteAdminRouter.put('/users/:id/role', authenticateToken, convertValuesToLowercase, createAdminAndDeleteAdmin);

module.exports = createAdminAndDeleteAdminRouter;