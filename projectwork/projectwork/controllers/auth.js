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
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;
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
    writeStream=fs.createWriteStream('output_main.txt')
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
        fetch('https://emotionalanalysishinditext.herokuapp.com//', {
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
            console.log(data);
             for(let j in data){
                myList.push(data[j])
                for(let k in data[j])
                {
                    writeStream.write(k + ":" + JSON.stringify(data[j][k]) + "\r\n");
                     
                }
            }
            if(rowNum==range.e.r)
            {
                //console.log(range.e.r)
                var myDataRange= myList.slice(rowNum+1,myList.length)
               // console.log(myDataRange)
                return res.render('analysis',{
                    message1: "Your analysis stats are ready"
                })
            }
        })
        .catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }//forloop
   
   
}

//api call ends
exports.temp=(req,res)=>{
    //var fs = require('fs');
        let positiveTrust=0
        let positiveJoy=0
        let positiveSurprise=0
        let negativeAnger=0
        let negativeFear=0
        let negativeSadness=0
        let nuetral=0
        let satire=0
        fileBuffer =  fs.readFileSync("./output_main.txt");
        to_string = fileBuffer.toString();
        split_lines = to_string.split("\r\n");
        //console.log(split_lines)
        for(let i = 0; i < split_lines.length;i++){
            if(split_lines[i] == "Emotion:\"Positive-Trust\""){
                //console.log("here")
                positiveTrust++;
            }
            else if(split_lines[i] == "Emotion:\"Positive-Joy\"")
            {
                positiveJoy++;
            }
            else if(split_lines[i] == "Emotion:\"Positive-Surprise\"")
            {
                positiveSurprise++;
            }
            else if(split_lines[i] == "Emotion:\"Negative-Anger\"")
            {
                negativeAnger++
            }
            else if(split_lines[i] == "Emotion:\"Negative-fear\"")
            {
                negativeFear++
            }
            else if(split_lines[i] == "Emotion:\"Negative-sadness\"")
            {
                negativeSadness++
            }
            else if(split_lines[i] == "Emotion:\"Negative-Anger\"")
            {
                negativeAnger++
            }
            else if(split_lines[i] == "Emotion:\"Nuetral\"")
            {
                nuetral++
            }
            else if(split_lines[i] == "Emotion:\"Satire\"")
            {
                satire++
            }

        }
        var numOfLines=(split_lines.length-1)/2;
        console.log(numOfLines)

        // var readMe = fs.readFileSync('./output_main.txt', 'utf8').split('\n');
        // let countp= 0;
        // for(let i = 0; i < readMe.length;i++){
        //     if(readMe[i] == "sentiment:\"Postive\""){
        //         countp++;
        //     }
        // }

        // console.log(countp);
        // var pospercent=((countp/numOfLines)*100).toFixed(2)
        // let countn=numOfLines-countp
        // console.log(countn)
        // var negpercent=((countn/numOfLines)*100).toFixed(2)
        
        console.log("trust:",positiveTrust)
        console.log("joy:",positiveJoy)
        console.log("surprise:",positiveSurprise)
        console.log("anger:",negativeAnger)
        console.log("fear:",negativeFear)
        console.log("sad:",negativeSadness)
        console.log("nuetral:",nuetral)
        console.log("satire:",satire)
        var trustPercent=((positiveTrust/numOfLines)*100).toFixed(2)
        var joyPercent=((positiveJoy/numOfLines)*100).toFixed(2)
        var surprisePercent=((positiveSurprise/numOfLines)*100).toFixed(2)
        var angerPercent=((negativeAnger/numOfLines)*100).toFixed(2)
        var fearPercent=((negativeFear/numOfLines)*100).toFixed(2)
        var sadnessPercent=((negativeSadness/numOfLines)*100).toFixed(2)
        var nuetralPercent=((nuetral/numOfLines)*100).toFixed(2)
        var satirePercent=((satire/numOfLines)*100).toFixed(2)
        //chart
        const chartWidth = 500;
        const chartHeight = 500;
        
        const arc = d3.arc()
          .outerRadius(chartWidth / 2 - 10)
          .innerRadius(0);
        
        const colours = ["#9ede73", "#be0000", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#763e9e"];
        function go(
          pieData = [trustPercent,joyPercent,surprisePercent,angerPercent,fearPercent,sadnessPercent,nuetralPercent,satirePercent],
          outputLocation = path.join('./test.svg')
        ) {
          const dom = new JSDOM("");
        
          dom.window.d3 = d3.select(dom.window.document); //get d3 into the dom
        
          //do yr normal d3 stuff
          const svg = dom.window.d3.select('body')
            .append('div').attr('class', 'container') //make a container div to ease the saving process
            .append('svg')
            .attr("xmlns", 'http://www.w3.org/2000/svg')
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .append('g')
            .attr('transform', 'translate(' + chartWidth / 2 + ',' + chartWidth / 2 + ')');
        
          svg.selectAll('.arc')
            .data(d3.pie()(pieData))
            .enter()
            .append('path')
            .attr("class", 'arc')
            .attr("d", arc)
            .attr("fill", (d, i) => colours[i])
            .attr("stroke", '#000000')
        
          //using sync to keep the code simple
          fs.writeFileSync(outputLocation, dom.window.d3.select('.container').html())
        }
        
        go()
        //chart
       // module.exports.poscount=countp;
       var svgTemplate= fs.readFileSync('./test.svg', 'utf8');
        res.render('temp',{
            svgTemplate:svgTemplate,
            //poscount:pospercent, 
            //negcount:negpercent
            postru: trustPercent,
            posjoy: joyPercent,
            possur: surprisePercent,
            negang: angerPercent,
            negfea: fearPercent,
            negsad: sadnessPercent,
            nuetral: nuetralPercent,
            satire: satirePercent
        })

        
            
    //chart
}

module.exports.upload=(req,res)=>{
    console.log('here1')

      var upload1 = multer({ storage: storage })

}



module.exports.logout=(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect("/index");
}
