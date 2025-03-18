const express = require("express");
const Student = require("../model/admin/student")
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
        const { name, studentId, branch, roll_no, district, email, contact_no } = req.body;
        const existingStudent = await Student.findOne({ studentId });
        if (existingStudent) return res.status(400).json({ error: "Student ID already exists" });

        // Create new student
        const student = new Student({
            name,
            studentId,
            branch,
            roll_no,
            district,
            email,
            contact_no
        });

        await student.save();
        res.redirect("/admin/dashboard");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;