const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const { logout_get } = require("../controllers/auth");

const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE

});

router.get('/',(req,res) => {
    res.render('index');
})

router.get('/login_page',(req,res) => {
    res.render('login_page');
})
// const {results}=require('./auth')
// router.get('/user_profile',(req,res) => {
//     res.render('user_profile',{
//         name:"name"
//     });
// })
// router.get('/signup_page',(req,res) => {
//     res.render('signup_page');
// })

router.get('/forgot_pwd',(req,res) => {
    res.render('forgot_pwd');
})
router.get('/edit_profile',(req,res)=>{
    res.render('edit_profile')
})
router.get('/home_page',(req,res)=>{
    res.render('home_page')
})
// router.get('/home_page',(req,res)=>{
//     res.render('home_page')
// })
// router.get("/logout",(req,res)=>{
//     res.cookie('jwt','',{maxAge:1});
//     res.render('index');
// })


module.exports = router;
