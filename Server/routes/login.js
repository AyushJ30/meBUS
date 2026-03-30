const express = require('express');

const upload = require('../storage');
const {handleUserSignUp, handleUserLogin} = require('../controllers/user');
const {handleAdminLogin, handleAdminLoginPage} =require('../controllers/admin');

const router = express.Router();

router.route('/signup')
    .post(upload.single('File'), handleUserSignUp);

router.route('/login')
    .post(handleUserLogin);    

router.route('/')
    .get(handleAdminLoginPage);
    
router.route('/admin-login')
    .post(handleAdminLogin);

module.exports = router;