const express = require('express');

const {restrictTo} = require('../middleware/auth');

const {handleFetchUserProfile, handleChangeUserPassword, handleFetchUserBookings, handleChangeUserDetails, handleUserLogout} = require('../controllers/user');

const router = express.Router();

router.route('/profile')
    .get(restrictTo(['Admin', 'User']) , handleFetchUserProfile)
    .patch(restrictTo(['Admin', 'User']), handleChangeUserDetails); 

router.route('/password')
    .patch(restrictTo(['Admin', 'User']), handleChangeUserPassword);

router.route('/logout')
    .post(restrictTo(['Admin', 'User']), handleUserLogout)

router.route('/booking')
    .get(restrictTo(['User']), handleFetchUserBookings);

module.exports = router;