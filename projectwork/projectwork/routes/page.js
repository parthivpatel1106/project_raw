const express = require("express");
const router = express.Router();
const mysql = require("mysql");

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
const val=require('./auth')
router.get('/user_profile',(req,res)=>{
    // db.query("SELECT *FROM users where id = ?",3, async (error,results,fields)=>{
    //     console.log("query start")
    //     if(error)
    //     {
    //         console.log("error:",error)
    //         res.send({
    //             "code":400,
    //             "failed":"error occured"
    //         })
    //     }else{
    //         console.log("working");
    //         console.log("val:",val);
            res.render('user_profile')
    //     }
    // })
})
router.get('/signup_page',(req,res) => {
    res.render('signup_page');
})

router.get('/forgot_pwd',(req,res) => {
    res.render('forgot_pwd');
})

module.exports = router;
