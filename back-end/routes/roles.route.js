const express = require('express');
const roles = require('../controllers/rolesController'); // Import controller

const router = express.Router();

router.post('/create',roles.createRole);
router.get('/show',roles.showRole);
router.delete('/delete/:id',roles.deleteRole);
router.post('/edit',roles.editRole);

module.exports = router;
