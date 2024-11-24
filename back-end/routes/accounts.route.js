const express = require('express');
const account = require('../controllers/userController'); // Import controller
const authorize = require('../controllers/middlewareUserController')

const router = express.Router();

router.post('/create',authorize.authorize("create_user"),account.createUser);
router.post('/send_again',authorize.authorize("create_user"),account.sendAgain);
router.get('/show',account.showUser);
router.delete('/delete/:id', account.deleteUser);
router.put('/edit/:id', account.editUser);

module.exports = router;
