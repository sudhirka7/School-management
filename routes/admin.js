const express = require("express");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const router = express.Router({ mergeParams: true });

const Admin = require("../model/admin/sign-up");
const Student = require("../model/admin/student");
const Billing = require("../model/admin/billing");

// Middleware: Auth check
const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    next();
};
const checkuser = (req, res, next) => {
    if (!req.session.user.userType == "adminWallah" ) {
        return res.redirect("/");
    }
    next();
};

// ──────── AUTH ROUTES ──────── //

router.get("/sign-up",authMiddleware,checkuser, async(req, res) => {
    res.render("admin/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
        return res.render("error.ejs", { msg: "User already exists!", link: "/admin/login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Admin({ name, email, password: hashedPassword });

    try {
        await user.save();
        console.log("✅ Admin registered successfully");
        res.redirect("/admin/sign-in");
    } catch (e) {
        console.error("Error saving admin:", e);
        res.render("error.ejs", { msg: "Internal Server Error", link: "/admin/sign-up" });
    }
});

router.get("/sign-in", (req, res) => {
    res.render("admin/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.render("error.ejs", { msg: "Email or Password Incorrect", link: "/admin/sign-in" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("error.ejs", { msg: "Email or Password Incorrect", link: "/admin/sign-in" });
        }

        req.session.user = user;

        if (user.userType === "adminWallah") {
            req.flash("success", "Logged in");
            return res.redirect("/admin/dashboard");
        } else {
            const student = await Student.findOne({ email: user.email });
            if (!student) {
                return res.render("error.ejs", { msg: "Student not found.", link: "/admin/sign-in" });
            }
            req.flash("success", "Login successfully!");
            return res.redirect(`/admin/view/${student._id}`);
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.render("error.ejs", { msg: "Something went wrong.", link: "/admin/sign-in" });
    }
});
router.get("/forget", (req, res)=>{
    res.render("admin/forget.ejs");
});
 

router.post("/forget", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await Admin.findOne({ email });

        if (!user || user.name !== name) {
            return res.render("error.ejs", {
                msg: "User name not Match please check",
                link: "/admin/forget"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.findOneAndUpdate(
            { email },
            { $set: { password: hashedPassword } }
        );

        req.flash("success", "Password updated successfully!");
        res.redirect("/admin/sign-in");

    } catch (error) {
        console.error("Forget Password Error:", error);
        res.render("error.ejs", {
            msg: "Something went wrong. Please try again.",
            link: "/admin/forget"
        });
    }
});

// ──────── DASHBOARD ──────── //

router.get("/dashboard", authMiddleware, async (req, res) => {
    const students = await Student.find({});
    const count = {
        all: await Student.countDocuments({}),
        dance: await Student.countDocuments({ category: "dance" }),
        singing: await Student.countDocuments({ category: "singing" }),
        physical: await Student.countDocuments({ category: "physical" }),
        zumba: await Student.countDocuments({ category: "zumba" }),
        painting: await Student.countDocuments({ category: "painting" }),
        yoga: await Student.countDocuments({ category: "yoga" }),
    };

    res.render("admin/dashboard.ejs", { students, count: Object.values(count) });
});

// ──────── STUDENT PROFILE ──────── //

router.get("/view/:id", authMiddleware, async (req, res) => {
    const {userType} = req.session.user;
    const student = await Student.findById(req.params.id);
    const invoices = await Billing.find({ studentId: req.params.id });
    res.render("admin/profile.ejs", { student, invoices, userType });
});

router.get("/Edit/:id", authMiddleware, async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render("admin/studentform.ejs", { student });
});

router.get("/delete/:id", authMiddleware, checkuser, async (req, res) => {
    const receipts = await Billing.find({ studentId: req.params.id });

    for (let rec of receipts) {
        await Billing.findByIdAndDelete(rec._id);
    }

    await Student.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
});

// ──────── BILLING ──────── //

router.get("/billing/:id", authMiddleware,checkuser, async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render("admin/billingForm.ejs", { student });
});

router.post("/billing/:id",authMiddleware, async (req, res) => {
    try {
        const {
            admission,
            tuition,
            other,
            securityDeposit,
            amountPaid,
            payment_month,
            totalAmount,
            balanceDue,
        } = req.body;

        // Update student's due payment
        await Student.findByIdAndUpdate(req.params.id, { duespayment: balanceDue });

        // Save billing record
        const newBill = new Billing({
            studentId: req.params.id,
            balanceDue,
            admission,
            tuition,
            other,
            securityDeposit,
            amountPaid,
            payment_month,
            totalAmount,
        });

        await newBill.save();
        res.redirect(`/admin/view/${req.params.id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/invoice/:id", authMiddleware, async (req, res) => {
    const invoice = await Billing.findById(req.params.id).populate("studentId");
    res.render("admin/invoice.ejs", { invoice });
});

// ──────── ADMIN PROFILE ──────── //

router.get("/adminprofile", authMiddleware, async (req, res) => {
    const admin = await Admin.findOne({ email: req.session.user.email });
    res.render("admin/adminprofile.ejs", { admin });
});

router.get("/profile", authMiddleware, (req, res) => {
    res.send("admin/profile");
});

module.exports = router;
