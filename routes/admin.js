const express = require("express");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const router = express.Router({ mergeParams: true });
const Admin = require("../model/admin/sign-up");
const Room = require("../model/admin/rooms.js");
const Student = require("../model/admin/student.js");
const Billing = require("../model/admin/billing.js");
const Rooms = require("../model/admin/rooms.js");

const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/admin/login");
    }
    next();
};

router.get("/login", (req, res) => {
    res.render("admin/sign-in.ejs");
});

router.get("/", async (req, res) => {
    const students = await Student.find({});
    console.log(students);
    res.send("Working");
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {

        return res.render("error.ejs", { msg: "Email or Password Incorrect", link: "/admin/login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        req.session.user = user;
        req.flash("success", "Loged In");
        res.redirect("/admin/dashboard");
    } else {
        res.render("error.ejs", { msg: "Email or Password Incorrect", link: "/admin/login" });
    }
});
router.get("/dashboard", authMiddleware, async (req, res) => {
    const email = req.session.user.email;
    const countCS = await Student.countDocuments({});
    const students = await Student.find({});
    const rooms = await Room.countDocuments({});
    const avarooms = await Room.countDocuments({ status: "F" });

    res.render("admin/dashboard.ejs", { countCS, rooms, avarooms, students });
})

router.get("/sign-up", (req, res) => {
    res.render("admin/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
        return res.render("error.ejs", { msg: "User Exists!", link: "/admin/login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Admin({ name, email, password: hashedPassword });

    user.save()
        .then(() => {
            console.log("Sign up data saved");
            res.redirect("/admin/login");
        })
        .catch((e) => {
            console.log("Error", e);
            res.render("error.ejs", { msg: "Internal Server Error", link: "/admin/sign-up" });
        });
});

router.get("/tables", authMiddleware, async (req, res) => {
    const students = await Student.find({}).populate("room");
    const rooms = await Rooms.find({ status: "F" });
    res.render("admin/tables.ejs", { students, rooms });
});

router.get("/view/:id", authMiddleware, async (req, res) => {
    const student = await Student.findOne({ _id: req.params.id });
    const invoices = await Billing.find({ student: req.params.id });
    res.render("admin/profile.ejs", { student, invoices });
});

router.get("/allocation/:id", authMiddleware, async (req, res) => {
    const student = await Student.findOne({ _id: req.params.id });
    const rooms = await Rooms.find({ status: "F" });
    res.render("admin/allocationForm.ejs", { student, rooms });
});
router.post("/allocation/:id", authMiddleware, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        const { roomId } = req.body;
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).send("Room not found");
        }

        // Update room status
        room.status = "T";
        await room.save();

        // Assign room to student
        student.room = roomId;
        await student.save();
        req.flash("success", "Room Allocated");
        res.redirect("/admin/tables");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/delete/:id", authMiddleware, async (req, res) => {
    const i = await Student.findOne({ _id: req.params.id });
    if (i.room) {
        const room = await Room.findByIdAndUpdate(
            { _id: i.room._id },
            { $set: { status: "F" } });
        room.save();
    }
    const student = await Student.findByIdAndDelete({ _id: req.params.id });
    res.redirect("/admin/tables");
});

router.post("/billing/:id", authMiddleware, async (req, res) => {
    try {
        // Extract data from form
        const studentObjId = req.params.id;
        const roomRent = Number(req.body.roomRent) || 0;
        const utilities = Number(req.body.utilities) || 0;
        const securityDeposit = Number(req.body.securityDeposit) || 0;
        const amountPaid = Number(req.body.amountPaid) || 0;
        const dues = Number(req.body.dues) || 0;
        const { studentId } = req.body;

        // Calculate amounts
        const totalAmount = roomRent + utilities + securityDeposit + dues;
        const balanceDue = totalAmount - amountPaid;

        // Update student's due balance

        const student = await Student.findByIdAndUpdate(
            studentObjId,
            { $set: { duespayment: balanceDue, } },
            { new: true }
        );

        if (!student) {
            return res.status(404).send("Student not found");
        }

        // Create new billing entry
        const data = new Billing({
            studentId,
            roomRent,
            utilities,
            securityDeposit,
            totalAmount,
            amountPaid,
            balanceDue,
            student: studentObjId
        });

        // Save the billing record
        const savedData = await data.save();

        if (savedData) {
            res.redirect(`/admin/invoice/${savedData._id}`);
        } else {
            res.render("error", { msg: "Data failed", link: "/admin/tables" });
        }
    } catch (error) {
        console.error("Error processing billing form:", error);
        res.status(500).send("Server Error");
    }
});

router.get("/invoice/:id", authMiddleware, async (req, res) => {
    const invoice = await Billing.findById({ _id: req.params.id })
        .populate(
            {
                path: "student",
                populate: { path: "room" }
            });

    res.render("admin/invoice.ejs", { invoice })

})


router.get("/invoice/:id", authMiddleware, async (req, res) => {
    const invoice = await findOne({ _id: req.params.id });
    res.render("admin/invoice.ejs", { invoice });
})


router.get("/billing", authMiddleware, async (req, res) => {
    const students = await Student.find({});
    res.render("admin/billing", { students });
});
router.get("/billing/:id", authMiddleware, async (req, res) => {

    let student = await Student.findOne({ _id: req.params.id });
    if (!student.room) {
        return res.redirect("/admin/tables")
    }
    student = await Student.findById({ _id: req.params.id }).populate("room");
    res.render("admin/billingForm", { student });
});
router.get("/profile", authMiddleware, (req, res) => {
    res.send("admin/profile");
});

router.get("/adminprofile", authMiddleware, async (req, res) => {
    const email = req.session.user.email;
    const admin = await Admin.findOne({ email })
    res.render("admin/adminprofile", { admin });
});

//adding some feature

router.get("/sectionba", authMiddleware, async (req, res) => {
    const student = await Student.find({});
    const room = await Room.find({});
})

module.exports = router;
