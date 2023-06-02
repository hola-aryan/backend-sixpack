import { log } from "console";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 
import path from "path";

const app = express();
mongoose.connect("mongodb://localhost:27017",
{dbName:"Backend"} )
.then(()=>{console.log("Connected");})
.catch((error)=>{console.log(error);} );

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})

const User = mongoose.model("User", userSchema);
const users = [];

// Using Middlewares
// app.use(express.static(path.join(path.resolve(),"public")))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const isAuthenticated = async (req,res,next)=>{
    const {token} = req.cookies;
    if(token){
        const decoded = jwt.verify(token,"sdsdsd");
        console.log(decoded);

        req.user = await User.findById(decoded._id)
        next();
    }
    else{
        res.redirect("/login")
    }
}

// Setting up view engine
app.set("view engine","ejs")

app.get("/", isAuthenticated,(req,res)=>{
    res.render("logout",{name: req.user.name}) 
    // const {token} = req.cookies;
    // if(token){
    //     res.render("logout")
    // }
    // else{
    //     res.render("login")
    // }
    // res.render ("login", {name : "Aryan Mishra"})
    // const pathlocation = path.resolve();
    
    // res.sendFile(path.join(pathlocation,"./index.html"))
    // res.send("Hello This is Home")
    // res.json({"Products": "Haha",
    // "Objexts": []})
})

app.get("/success",(req,res)=>{
    res.render ("success")
})

app.get("/add",(req,res)=>{
    message.create({name: "Aryan2", email:"sample2@gmail.com"})
    .then(()=>{res.send("nice");})
    .catch((error)=>{res.send(error);})
})

app.get("/users",(req,res)=>{
    res.json ({users})
})

app.get("/login",(req,res)=>{
    res.render ("login", {name:" Nigga"})
})

app.get("/register",(req,res)=>{
    res.render ("register")
})

app.post("/login", async(req,res)=>{ 
    const {email,password}=req.body;

    let user = await User.findOne({email});

    if(!user) return res.redirect("/register")

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) return res.render("login", {name:"Add Correct Password Nigga"})

    const token = jwt.sign({_id:user._id},"sdsdsd")

    res.cookie("token",token) 
    res.redirect("/")
    
})
app.post("/register", async(req,res)=>{ 
    console.log(req.body);

    const {name,email,password} = req.body;
    let user = await User.findOne({name})

    if(user){
        return res.redirect("/login")
    }

    const hashedPassword = await bcrypt.hash(password,10);

    user = await User.create({name, email, password : hashedPassword})

    const token = jwt.sign({_id:user._id},"sdsdsd")

    res.cookie("token",token) 
    res.redirect("/")
})

app.get("/logout",(req,res)=>{ 
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    })
    res.redirect("/")
})

// app.post("/contact",async(req,res)=>{
//     // console.log(req.body);
//     console.log(req.body.password);
//     await message.create({name:req.body.email, email:req.body.password})
//     res.redirect("/success")
// })

app.listen(5000,()=>{
    console.log("wassup Nigga well done you created this dope app");
})