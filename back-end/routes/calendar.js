const express = require('express');
const calendar = require('../controllers/calendarController'); // Import controller

const router = express.Router();

router.post('/create',calendar.createEvent);
router.put('/update/:id',calendar.updateEvent);
router.get('/show',calendar.getEvents);
router.delete('/delete/:id',calendar.deleteEvents);

module.exports = router;