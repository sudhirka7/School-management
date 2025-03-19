const express = require("express");
const Student = require("../model/admin/student");
const router = express.Router();

const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/admin/login");
    }
    next();
};

router.get("/registration",authMiddleware, async (req, res)=>{
    res.render("student/registration.ejs");
});

// Register Student
router.post("/register", async (req, res) => {
    try {
       const  {student} = req.body;
       const existingStudent = await Student.findOne({studentId:student.studentId });
        if (existingStudent) return res.status(400).json({ error: "Student ID already exists" });

        // Create new student
        const studentadd = new Student(student);

        await studentadd.save();
        res.redirect("/admin/dashboard");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;