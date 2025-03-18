const bcrypt = require("bcrypt");
const admin = require("../model/admin/sign-up.js");
const db = require("../config/db");
require("dotenv").config();

const connectDB = async () => {
    try {
        await db();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};

const addUser = async () => {
    try {
        const email = "sudhirka7@gmail.com";
        const existingUser = await admin.findOne({ email });

        if (existingUser) {
            console.log("User already exists!");
            return;
        }

        const hashedPassword = await bcrypt.hash("12345", 10);
        const newUser = new admin({
            name: "Sudhir Kumar",
            email: email,
            password: hashedPassword,
        });

        await newUser.save();
        console.log("User Added Successfully!");
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

const delUsers = async () => {
    try {
        await admin.deleteMany({});
        console.log("All Users Deleted");
    } catch (error) {
        console.error("Error deleting users:", error);
    }
};

const run = async () => {
    await connectDB();
    await delUsers();
    await addUser();
};

run();
