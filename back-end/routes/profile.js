const express = require('express');
const profile = require('../controllers/profile.js'); // Import controller

const router = express.Router();

router.post('/get_profile', profile.get_profile);

module.exports = router;
