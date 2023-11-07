const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const app=express()
const port=3000;
const mongoose =require("mongoose");
const md5=require("md5");
app.use(bodyParser.urlencoded({extented:true}))
app.set('view engine', 'ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/login");
let islogin=false;
let username="";
const personSchema=new mongoose.Schema({
    name:String,
    Mobile:String,
    email:String,
    password:String

})
const person =mongoose.model("person",personSchema);
const detailSchema=new mongoose.Schema({
    name:String,
    Mobile:String,
    When:String,
    Date:String,
    Start:String,
    End:String

})
const detail=mongoose.model("detail",detailSchema);

const messageSchema=new mongoose.Schema({
    Name:String,
    Email:String,
    Subject:String,
    Message:String
})
const message=mongoose.model("message",messageSchema);

const driverSchema=new mongoose.Schema({
    Name:String,
    Mobile:String,
    Age:{
        type:Number,
        max:50,
        min:21
    },
    Car:String
})
const driver=mongoose.model("driver",driverSchema);
app.get("/",(req,res)=>{    
    res.render("index",{islogin:islogin,name:username});
})
app.post("/",(req,res)=>{
   res.render("Form");
})
app.post("/join",(req,res)=>{
    if(req.body.button=="Reg")res.render("signup")
    else if(req.body.button=="Log") res.render("login")
})
app.post("/log",(req,res)=>{
    res.render("login")
})
app.post("/reg",(req,res)=>{
    res.render("signup")
})
app.post("/Login",(req,res)=>{
    var email=req.body.email;
    var pass=req.body.password;
    person.find({email:email},(err,data)=>{
        if(err)console.log(err);
        else {
            
        if(data[0].password===md5(pass)){
             islogin=true;
             username=data[0].name;
            res.redirect("/");
            
        } 
            
            else res.render("submitted",{sentence:"Email or password is not correct"})
        }
     
    })
})

app.post("/Register",(req,res)=>{
    console.log("fetching details of sign up");
    const name=req.body.name;
    const email=req.body.email;
    const mob=req.body.Mobile;
    const pass=req.body.password;
    person.find({email:email},(err,data)=>{
        console.log("seraching into persons")
        if(data.length)res.render("submitted",{sentence:"User with same email already exists"})
        else{
             person.insertMany([{name:name,email:email,Mobile:mob,password:md5(pass)}],(err)=>{
        if(err)console.log(err);
        else {
            islogin=true;
            username=name;
            res.redirect("/");
        
        }
    })
        }
    })
   

})

app.post("/book",(req,res)=>{
    detail.insertMany([{name:req.body.name,Mobile:req.body.number,When:req.body.When,Date:req.body.date,Start:req.body.start,End:req.body.end}],(err)=>{
        if(err)console.log(err);
        else res.render("submitted",{sentence:"Your cab is booked , happy journey"})
    })
   
})
app.post("/message",(req,res)=>{
    message.insertMany([{Name:req.body.name,Email:req.body.email,Subject:req.body.subjec,Message:req.body.message}],(err)=>{
        if(err)console.log(err);
        else res.render("submitted",{sentence:"Your message has been sent, we will be in touch with you"});
    })
})
app.post("/submitted",(req,res)=>{
    res.redirect("/");
})
app.post("/add",(req,res)=>{
    driver.insertMany([{Name:req.body.Name,Mobile:req.body.Mobile,Age:Number(req.body.Age),Car:req.body.Car}],(err)=>{
        if(err)console.log(err);
        else res.render("submitted",{sentence:"You are now a member of our family"});
    })
})
app.post("/logout",(req,res)=>{
    islogin=false;
    username="";
    res.redirect("/");
})
app.listen(port,()=>{
    console.log(`app started successfully on port ${port}`)
})