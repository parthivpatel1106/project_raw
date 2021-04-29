const express = require("express");
const app = express();
const mysql = require("mysql");
const jwt=require("jsonwebtoken");
const dotenv = require('dotenv');
const path = require("path");
var request=require("request");
const cookieParser = require('cookie-parser');
const { response } = require("express");
const fetch = require("node-fetch")
var fs = require('fs');
var multer = require('multer');
var bodyParser=require('body-parser');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
//var fileupload = require("express-fileupload");
//app.use(fileupload());
dotenv.config({path : './.env'});

// app.use(express.json());
// app.use(express.urlencoded({
//     extended:true,
// }))

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


app.use('/',require('./routes/page'));
app.use('/auth',require('./routes/auth'));
// app.get('/main',function(req,res){
//     request('http://127.0.0.1:5500/flask',function(error,response,body){
//         console.error('error:',error)
//         console.log('statusCode:',response&&response.statusCode);
//         console.log('body:',body);
//         res.send(body)
//     })
//    // res.render('index');
// })
// app.get('/predict',function(req,res){
//     request('http://127.0.0.1:5500/predict',function(error,response,body){
//         var movies = {
//             'title': 'hello',
//             'release_date': 'world'
//             }
        
//         $.get({
//         url: Flask.url_for('my_function'),
//         type: 'POST',
//         data: JSON.stringify(movies),   // converts js value to JSON string
//         })
//         .done(function(result){     // on success get the return object from server
//             console.log(result)     // do whatever with it. In this case see it in console
//         })
//         console.error('error:',error)
//         console.log('statusCode:',response&&response.statusCode);
//         console.log('body:',body);
//         res.send(body)
//     })
//    // res.render('index');
// })
// app.post('/predict',function(req,res){
//     request('http://127.0.0.1:5500/predict',function(error,response,body){
//         console.error('error:',error)
//         console.log('statusCode:',response&&response.statusCode);
//         console.log('body:',body);
//         res.send(body)
//     })
// })


//api call code starts

app.get('/predict',function(req,res){
    fetch('https://sentimentanlysisprediction.herokuapp.com//', {
	method: 'POST',
	body: JSON.stringify({
    "comment": {0:"this movie is good that i slept"}
		 
    
	}),
	headers: {
		'Content-type': 'application/json;'
	}
}).then(function (response) {
	if (response.ok) {
		return response.json();
	}
	return Promise.reject(response);
}).then(function (data) {
	console.log(data);
}).catch(function (error) {
	console.warn('Something went wrong.', error);
});
})

//api call code ends


var multer = require('multer');
// var upload = multer({dest: 'uploads/'});

// app.post('/single', upload.single('file1'), function (req, res) {
//  console.log(req.file)
// })
var counter=1
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        counter=counter+1
      cb(null,"--"+counter+"_"+ file.originalname)
    }
  })
  var upload = multer({ storage: storage })

  app.post('/single', upload.single('file1'), function(req, res, next) {
    var fileinfo = req.file;
    module.exports.myFile=fileinfo.filename
    var title = req.body.title;
    console.log(title);
    console.log(fileinfo.filename)
    res.render('analysis',{
        message:'file is uploaded'
    });
  })

  // app.use((req, res, next) => {
  //   if(!req.session.userId) {
  //     return next();
  //   } 
  // })

app.listen(5000, () =>{
    console.log("server started on port 5000");
})

