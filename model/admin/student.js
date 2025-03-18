const mongoose = require('mongoose');
const Billing = require("./billing.js");
const Room = require("./rooms.js");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    gender:{
        type: String, required: true, enum: ["F", "M"],
    },
    studentId: {
        type: String, // Changed to String to handle leading zeros if needed
        required: true,
        unique: true,
        trim: true
    },
    branch: {
        type: String,
        required: true,
        trim: true},
    roll_no: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String, enum:["Paid", "Not Paid"], default: "Not Paid",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    contact_no: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Invalid contact number"] // Ensures exactly 10 digits
    },
    image_url: {
        type: String,
        default: "/img/default-profile.jpg" // Changed filename to be more generic
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "room"
    },
    father_name:{
        type:String, required: true,
    },
    mother_name:{
        type:String, required: true,
    },
    father_contact:{
        type:Number, required: true,
    },
    date_of_joinning:{
        type:String, required:true,
    },
    date_of_birth:{
        type: String,
    },

    duespayment:{type:Number, required:true, default:0}
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
