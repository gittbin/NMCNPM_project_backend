const express = require('express');
const roles = require('../controllers/rolesController'); // Import controller
const Author=require("../controllers/middlewareUserController.js")
const router = express.Router();

router.post('/create',Author.authorize("*role"),roles.createRole);
router.get('/show',roles.showRole);
router.delete('/delete/:id',Author.authorize("*role"),roles.deleteRole);
router.post('/edit',Author.authorize("*role"),roles.editRole);

module.exports = router;
