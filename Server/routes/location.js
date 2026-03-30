const express = require('express');

const {restrictTo} = require('../middleware/auth');
const {fetchActiveOriginCities, fetchActiveDestinationCities} = require('../controllers/activeLocation');

const router = express.Router();

router.route('/from')
    .get(fetchActiveOriginCities);

router.route('/to/:id')
    .get(fetchActiveDestinationCities);
    
module.exports = router;