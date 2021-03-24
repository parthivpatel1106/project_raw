const express = require("express");
const router = express.Router();

router.get('/',(req,res) => {
    res.render('index');
})

router.get('/login_page',(req,res) => {
    res.render('login_page');
})

router.get('/signup_page',(req,res) => {
    res.render('signup_page');
})

router.get('/forgot_pwd',(req,res) => {
    res.render('forgot_pwd');
})

module.exports = router;
