const express = require('express');
const account = require('../controllers/userController'); // Import controller

const router = express.Router();

router.post('/create',account.createUser);
router.get('/show',account.showUser);
router.delete('/delete/:id', account.deleteUser);
router.put('/edit/:id', account.editUser);

module.exports = router;
