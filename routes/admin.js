const express = require("express");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const router = express.Router({ mergeParams: true });
const Admin = require("../model/admin/sign-up");
const Student = require("../model/admin/student.js");
const Billing = require("../model/admin/billing.js");


const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    next();
};

 

router.get("/", async (req, res) => {
    res.render("admin/sign-up.ejs");
});
router.get("/sign-in", async (req, res) => {
    res.render("admin/sign-in.ejs");
});


router.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {

        return res.render("error.ejs", { msg: "Email or Password Incorrect", link: "/admin/sign-in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        req.session.user = user;
        if(user.userType == "adminWallah"){
         res.redirect("/admin/dashboard");   
        }else{
            const student = Student.findOne({email:user.email});
            res.redirect(`/admin/view${student._id}`);
        }
        
    } else {
        res.render("error.ejs", { msg: "Email or Password Incorrect", link: "/admin/login" });
    }
});
router.get("/dashboard", authMiddleware, async (req, res) => {
    const email = req.session.user.email;
    const students = await Student.find({}); 
    const all = await Student.countDocuments({}); 
    const dance = await Student.countDocuments({category:"dance"}); 
    const singing = await Student.countDocuments({category:"dance"}); 
    const physical = await Student.countDocuments({category:"dance"}); 
    const zumba = await Student.countDocuments({category:"dance"}); 
    const painting = await Student.countDocuments({category:"dance"}); 
    const yoga = await Student.countDocuments({category:"dance"}); 
    const count = [all,dance, painting, physical, singing, yoga, zumba];
    console.log(count[0]);

    res.render("admin/dashboard.ejs", { students, count });
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
            res.redirect("/admin/sign-in");
        })
        .catch((e) => {
            console.log("Error", e);
            res.render("error.ejs", { msg: "Internal Server Error", link: "/admin/sign-up" });
        });
});

router.get("/Edit/:id", authMiddleware, async (req, res)=>{
    const student = await Student.findOne({_id:req.params.id})
    res.render("admin/studentform.ejs",{student});
}) 

router.get("/view/:id", authMiddleware, async (req, res) => {
    const student = await Student.findOne({ _id: req.params.id });
    const invoices = await Billing.find({ studentId: req.params.id });
    res.render("admin/profile.ejs", { student, invoices });
});
 

 
router.get("/delete/:id", authMiddleware, async (req, res) => {
    const i = await Student.findOne({ _id: req.params.id });
    const reciepts = await Billing.find({studentId: req.params.id});
    console.log(reciepts);
    for(let re of reciepts){
        await Billing.findByIdAndDelete({_id:re._id});
    }
    await Student.findByIdAndDelete({ _id: req.params.id });
    res.redirect("/admin/dashboard");
});

 
// 🔹 Create a new bill
router.post("/billing/:id", async (req, res) => {
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
        

       
        // Ensure that the balanceDue is a valid number
        let updateBalance = balanceDue;
        console.log(updateBalance);

        // Update the student's duespayment field
           await Student.findByIdAndUpdate(
            req.params.id, // The student's ID
            { $set: { duespayment: updateBalance } }, // The update operation
            { new: true } // Return the updated document
        );

        // Create a new billing record
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

        // Save the billing record
        await newBill.save();

        // Redirect to the student's profile page
        res.redirect("/admin/profile");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get("/invoice/:id", authMiddleware, async (req, res) => {
    const invoice = await Billing.findById({ _id: req.params.id }).populate("studentId");
    res.render("admin/invoice.ejs", { invoice })

})




 
router.get("/billing/:id", authMiddleware, async (req, res) => {

    let student = await Student.findOne({ _id: req.params.id });
    student = await Student.findById({ _id: req.params.id });
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

 
 

module.exports = router;
