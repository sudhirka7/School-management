const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const engine = require("ejs-mate");
const dotenv = require("dotenv");

// Load env variables
dotenv.config();

// Database connection
const db = require("./config/db");
db();

// Routes
const AdminRoutes = require("./routes/admin.js");
const StudentRoutes = require("./routes/student.js");

const app = express();

// ---------- MIDDLEWARES ---------- //

// Session configuration
const sessionOptions = session({
    secret: process.env.SECRET || "keyboard cat", // Fallback if .env is missing
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
});
app.use(sessionOptions);

// Flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Body parsing and static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- ROUTES ---------- //

app.use("/admin", AdminRoutes);
app.use("/student", StudentRoutes);

// Primary routes
app.get("/", (req, res) => {
    res.render("primary/index");
});
app.get("/classes", (req, res) => {
    res.render("primary/classes");
});
app.get("/about", (req, res) => {
    res.render("primary/about");
});
app.get("/enrollstudent", (req, res) => {
    res.render("primary/studentform.ejs");
});

// ---------- START SERVER ---------- //

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
