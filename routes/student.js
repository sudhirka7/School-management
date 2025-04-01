const express = require("express");
const Student = require("../model/admin/student.js");
const router = express.Router();
const session = require("express-session");
const flash = require("connect-flash");


const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/admin/sign-in");
    }
    next();
};

router.get("/registration",authMiddleware, async (req, res)=>{
    res.render("student/registration.ejs");
});

// Register Student
router.post("/register", async (req, res) => {
    try {
         
        const {studentName,
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
            return res.status(400).json({ error: "Invalid student details" });
        }

        const student = await Student.findOne({ email: email });
        if(student){
            return res.status(400).json({ error: "Gmail allready exist!" });
        }
        
        const user = new Student({
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

        try {
            await user.save();
            req.flash("success", "Your form was submitted successfully!");
            res.redirect("/admin/dashboard");
        } catch (error) {
            req.flash("error", "Form submission failed. Please try again.");
            res.redirect("/admin/form");
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;