const express = require("express");
const path = require("path");
const session = require("express-session")
const Admin = require("./routes/admin.js");
const Student = require("./routes/student.js");
const db = require("./config/db");
const engine = require("ejs-mate");
const flash = require("connect-flash");
const app = express();
require("dotenv").config();
db();




// middleware
const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    next();
};
const sessionOpt = session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
         
})

// for session 
app.use(sessionOpt);
app.use(flash());
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
app.use("/admin", Admin);
app.use("/student", Student);
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");



//Primary
app.get("/", (req, res)=>{
    res.render("primary/index");
});

app.get("/classes", (req, res)=>{
    res.render("primary/classes");
});

app.get("/about", (req, res)=>{
    res.render("primary/about");
});
app.get("/enrollstudent", (req, res)=>{
    res.render("primary/studentform.ejs");
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
