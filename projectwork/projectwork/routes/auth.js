const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/signup_page',authController.signup_page);
router.post('/login_page',authController.login_page);
//
//router.get('/login_page',(req,res) => {
//    res.render('login_page');
//})
//
//router.get('/signup_page',(req,res) => {
//    res.render('signup_page');
//})
//
//router.get('/forgot_pwd',(req,res) => {
//    res.render('forgot_pwd');
//})
//
module.exports = router;
