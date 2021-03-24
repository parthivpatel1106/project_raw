const express = require("express");
const app = express();
const mysql = require("mysql");
const dotenv = require('dotenv');
const path = require("path");
const cookieParser = require('cookie-parser');

dotenv.config({path : './.env'});

const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE

});

const publicDirectory = path.join(__dirname,'./public');

app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');


db.connect( (error) =>{
  if(error){
      console.log(error);
  }else{
      console.log("MYSQL CONNECTED");
  }
})

//app.get("/",(req,res) =>{
//  //res.send("<h1> home</h1>")
//  res.render("index");
//});
//
//app.get("/login_page",(req,res) =>{
//    //res.send("<h1> home</h1>")
//    res.render("login_page");
//});
//
//app.get("/forgot_pwd",(req,res) =>{
//    //res.send("<h1> home</h1>")
//    res.render("forgot_pwd");
//});
//
//app.get("/signup_page",(req,res) =>{
//    //res.send("<h1> home</h1>")
//    res.render("signup_page");
//});

app.use('/',require('./routes/page'));
app.use('/auth',require('./routes/auth'));

app.listen(5000, () =>{
    console.log("server started on port 5000");
})

