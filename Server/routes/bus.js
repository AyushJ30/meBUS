const express = require('express');

const {restrictTo} = require('../middleware/auth');
const {handleFetchBusesEnroute, handleFetchBusDetails, handleFetchBookedSeats} = require('../controllers/bus'); 
const {handleBusBook} = require('../controllers/booking');

const router = express.Router();

router.route('/:id')
    .get(restrictTo(['Admin', 'User']), handleFetchBusDetails)
    .post(restrictTo(['Admin', 'user']), handleBusBook);

router.route('/:id/seats')
    .get(restrictTo(['Admin', 'User']), handleFetchBookedSeats);


module.exports = router;
