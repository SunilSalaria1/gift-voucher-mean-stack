const express = require('express');
const updateUserRoleRouter = express.Router();
const { updateUserRole } = require("../controllers/updateUserRole.controller");
const { authenticateToken } = require("../middlewares/auth.middleWare")

// routes for create Admin And Delete the admin
updateUserRoleRouter.put('/users/:id/role', authenticateToken, updateUserRole);

module.exports = updateUserRoleRouter;