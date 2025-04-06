const express = require("express");
const bcrypt = require("bcrypt");
const Student = require("../model/admin/student.js");
const Admin = require("../model/admin/sign-up");
const router = express.Router();
const flash = require("connect-flash");

// Auth middleware
const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/admin/sign-in");
    }
    next();
};

// Registration page
router.get("/registration", authMiddleware, async (req, res) => {
    res.render("student/registration.ejs");
});

// Register Student
router.post("/register", async (req, res) => {
    try {
        const {
            studentName,
            parentName,
            callingNumber,
            whatAppNumber,
            relation,
            gender,
            email,
            dob,
            address,
            category,
            age,
            joinDate,
        } = req.body;

        if (!email) {
            req.flash("error", "Email is required.");
            return res.redirect("/student/registration");
        }

        // Check if user already exists in either Admin or Student
        const studentExists = await Student.findOne({ email });
        const adminExists = await Admin.findOne({ email });

        if (studentExists || adminExists) {
            req.flash("error", "Email already exists!");
            return res.redirect("/student/registration");
        }

        // Save Student
        const newStudent = new Student({
            studentName,
            parentName,
            callingNumber,
            whatAppNumber,
            relation,
            gender,
            email,
            dob,
            address,
            category,
            age,
            joinDate,
        });

        // Save login credentials for student
        const hashedPassword = await bcrypt.hash("12345", 10);
        const loginCred = new Admin({
            name: studentName,
            email,
            password: hashedPassword,
            userType: "student" // Add userType to differentiate roles
        });

        await newStudent.save();
        await loginCred.save();

        req.flash("success", "Student registered successfully!");
        res.redirect("/admin/dashboard");

    } catch (error) {
        console.error(error);
        req.flash("error", "Internal server error.");
        res.redirect("/student/registration");
    }
});

module.exports = router;
