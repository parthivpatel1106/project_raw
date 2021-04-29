const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const excelToJson = require('convert-excel-to-json');
var bodyParser = require('body-parser');
const XLSX =require('XLSX');
var FileReader = require('filereader')
var fs=require('fs');
var path = require('path');
const fetch = require("node-fetch")
var multer = require('multer');
const readline = require("linebyline");
var d3=require("d3")
// var JSDOM = require('jsdom').JSDOM;
// // Create instance of JSDOM.
// var jsdom = new JSDOM('<body><div id="container"></div></body>', {runScripts: 'dangerously'});
// // Get window
// var window = jsdom.window;
// writeStream=fs.createWriteStream('output8.txt')
// var request=require('request')
// const sf =require('../public/exceltojason');
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE

});
exports.login_page = async (req,res) => {
    try{

       const {email,password} = req.body;
       if(!email || !password){
          return res.status(400).render('login_page',{
              message : 'please provide email and password'

          });
      }

      db.query('SELECT * FROM users WHERE email = ?', [email],async (error,results) =>{
        module.exports.val=results.id
          console.log(results);
         if( !results || !(await bcrypt.compare(password,results[0].password))){
             res.status(401).render('login_page',{
                 message : 'email or password is incorrect'
             })
         }else{
             const id = results[0].id;
             const token = jwt.sign({id},process.env.JWT_SECRET, {
                 expiresIn : process.env.JWT_EXPIRES_IN
             });
             console.log("token is "+token);

             const cookieOption = {
                 expires: new Date(
                     Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                 ),
                 httpOnly : true
             }
             res.cookie('jwt',token,cookieOption);
            //res.status(200).redirect("/user_profile");
         }
      })
    //   db.query("SELECT *FROM users where email = ?",[email], async (error,results,fields)=>{
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
    //         // console.log("val:",val);

    //         res.render('user_profile',{message:"working",items:results})
    //     }
    // })
    }catch(error){
      console.log(error);
    }
}
exports.edit_profile=(req,res)=>{
    console.log(req.body)
    const{proimg,compname,compadd,cityname,web_site}=req.body;
    db.query('INSERT INTO user_data SET?', {city:cityname,email:useremail,company_address:compadd,company_name:compname,website:web_site,profile_picture:proimg},(error,results)=>{
        if(error){
            console.log(error);
        }else{
          console.log(results);
          return res.render('edit_profile',{
            message : 'your data is updated'
        });
        }
    });

}
exports.signup_page = (req,res) => {
    console.log(req.body);

   // const fname = req.body.f_name;
    //const lname = req.body.l_name;
    //const email = req.body.email;
    //const pwd = req.body.pwd;
    //const cpwd = req.body.c_pwd;


    const {fname,lname,email,pwd,c_pwd} = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error,results) => {

        if(error){
            console.log(error);
        }

        if(results.length > 0){
            return res.render('signup_page',{
                message : 'email has been already used'
            })
        }else if(pwd !== c_pwd ){
            return res.render('signup_page',{
                message : 'password do not match'
            });
        }

        let hashedPassword = await  bcrypt.hash(pwd, 8);
        console.log(hashedPassword);
       // res.send("testing");

        db.query('INSERT INTO users SET ?', {first_name : fname,last_name : lname, email : email,password : hashedPassword}, (error,results) =>{
          if(error){
              console.log(error);
          }else{
            console.log(results);
            return res.render('signup_page',{
                message : 'you have been registered successfully'
            });
          }

        })
    });

    //res.send("FORM SUBMITED");

}
exports.user_profile=(req,res)=>{
    const{email}=req.body;
    global.useremail=email;
    db.query("SELECT *FROM users where email = ?",[email], async (error,results,fields)=>{
        console.log("query start")
        console.log(useremail)
        if(error)
        {
            console.log("error:",error)
            res.send({
                "code":400,
                "failed":"error occured"
            })
        }else{
            res.render('user_profile',{items:results})
            return
        }
    })
}
exports.user_profile1=(req,res)=>{
    db.query("SELECT *FROM users where email = ?",[useremail], async (error,results,fields)=>{
        console.log("query start")
        if(error)
        {
            console.log("error:",error)
            res.send({
                "code":400,
                "failed":"error occured"
            })
        }else{
            res.render('user_profile',{items:results})
            return
        }
    })
}
exports.edit_profile1=(req,res)=>{
    db.query("SELECT *FROM user_data where email=?"[useremail],async(error,outputs,fields)=>{
        console.log("start")
        if(error)
        {
            console.log("error:",error)
            res.send({
                "code":400,
                "failed":"error occured"
            })
        }else{
            res.render('user_profile',{dataitem:outputs})
        }
    })
}
exports.home_page=(req,res)=>{
    console.log("homepage working");
    return res.render('home_page');
}

//api call starts
var myFile=require('../app')
var myMap={}
var myList=[]
// var tempList=[]
// var myData={
//     0:"nice",
//     1:"cool",
//     2:"hey"
// }
exports.predict=(req,res)=>{
    writeStream=fs.createWriteStream('output14.txt')
    //const {file1} = req.file;
     //const xlsxFile = require('read-excel-file/node');
     console.log("filename:",myFile.myFile)
     const table = XLSX.readFile(`./uploads/${myFile.myFile}`);
    const sheet = table.Sheets[table.SheetNames[0]];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    // Example: Get second cell in each row, i.e. Column "B"
    const secondCell = sheet[XLSX.utils.encode_cell({r: rowNum, c: 0})];
    // NOTE: secondCell is undefined if it does not exist (i.e. if its empty)
    //console.log(secondCell.v);
 // secondCell.v contains the value, i.e. string or number
                myList.push(secondCell.v)
                myMap.new_key1 = secondCell.v;
       //console.log(myMap)
        fetch('https://sentimentanlysisprediction.herokuapp.com//', {
        method: 'POST',
        body: JSON.stringify({
        "comment":myMap
        }),
        headers: {
            'Content-type': 'application/json;'
        }
    }).then(function (response) {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response);
        }).then(function (data) {
            //console.log(data);
             for(let j in data){
                writeStream.write(j + ":" + JSON.stringify(data[j]) + "\r\n");
                myList.push(data[j]) 
                
            }
            if(rowNum==range.e.r)
            {
                var myDataRange= myList.slice(10,myList.length)
                console.log(myDataRange)
                return res.render('analysis',{
                    message1:JSON.stringify(myDataRange)
                })
            }
        })
        .catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }//forloop
   
   
}

//api call ends
// exports.temp=(req,res)=>{
//     var fs = require('fs');

//         fileBuffer =  fs.readFileSync("./output12.txt");
//         to_string = fileBuffer.toString();
//         split_lines = to_string.split("\n");
//         var numOfLines=(split_lines.length-1)/2;
//         console.log(numOfLines)

//         var readMe = fs.readFileSync('./modified4.txt', 'utf8').split('\n');
//         let countp= 0;

//         for(let i = 0; i < readMe.length;i++){
//             if(readMe[i] == 'sentiment:"Postive"'){
//                 countp++;
//             }
//         }

//         console.log(countp);
//         let countn=numOfLines-countp
//         console.log(countn)
//         module.exports.poscount=countp;
//         res.render('temp',{
//             message2:countp
//         })

        
            
//     //chart
// }

module.exports.upload=(req,res)=>{
    console.log('here1')

      var upload1 = multer({ storage: storage })

}



module.exports.logout=(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect("/index");
}
