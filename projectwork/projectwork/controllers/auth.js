const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



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
            //  res.status(200).redirect("/user_profile");
         }
      })
      db.query("SELECT *FROM users where email = ?",[email], async (error,results,fields)=>{
        console.log("query start")
        if(error)
        {
            console.log("error:",error)
            res.send({
                "code":400,
                "failed":"error occured"
            })
        }else{
            console.log("working");
            // console.log("val:",val);
            res.render('user_profile',{message:"working",items:results})
        }
    })
    }catch(error){
      console.log(error);
    }
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
    db.query("SELECT *FROM users",{first_name,last_name,email},(error,rows,fields)=>{
        console.log("query start")
        if(error)
        {
            console.log("error:",error)
            res.send({
                "code":400,
                "failed":"error occured"
            })
        }else{
            res.render('user_profile',{message:"working",items:rows})
            return
        }
    })
}

