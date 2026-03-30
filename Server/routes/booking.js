const express = require('express');
const { restrictTo } = require('../middleware/auth');
const { handleFetchBoardingPoints, handleFetchDropPoints, handlePassengerDetails, handleBusBook, handleCancelUserBookings, handleSendTicketEmail} = require('../controllers/booking');
const { handleFetchUserBookings } = require('../controllers/user');

const router = express.Router();


router.route('/board/:origin')
    .get(restrictTo(['Admin', 'User']), handleFetchBoardingPoints);

router.route('/drop/:dest')
    .get(restrictTo(['Admin', 'User']), handleFetchDropPoints); 

router.route('/passenger/:id')
    .post(restrictTo(['Admin', 'User']), handlePassengerDetails);

router.route('/pay/:id')
    .post(restrictTo(['Admin', 'User']), handleBusBook)

router.route('/')
    .get(restrictTo(['Admin', 'User']), handleFetchUserBookings)

router.route('/cancel/:id')
    .post(restrictTo(['Admin', 'User']), handleCancelUserBookings);

router.route('/send-ticket-email')
    .post(restrictTo(['Admin', 'User']), handleSendTicketEmail);

module.exports = router; 