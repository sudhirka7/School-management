const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate emails
    },
    userType:{
        type:String,
        default: "userStudent",
    },
    password: {
        type: String,
        required: true,
    },
});

// Corrected model export
module.exports = mongoose.model("Admin", userSchema);
