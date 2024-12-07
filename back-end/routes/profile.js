const express = require('express');
const profile = require('../controllers/profile.js'); // Import controller

const router = express.Router();

router.post('/get_profile', profile.get_profile);
router.post('/change_profile', profile.change_profile);
router.post('/update_avatar', profile.update_avatar);
module.exports = router;
