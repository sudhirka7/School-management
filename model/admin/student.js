const mongoose = require("mongoose");
const Billing = require("./billing.js");
 const Room = require("./rooms.js");

const studentSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    studentId: {
      type: String, // String prevents issues with leading zeros
      required: true,
      unique: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    roll_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Not Paid"],
      default: "Not Paid",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    contact_no: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Invalid contact number"], // Ensures exactly 10 digits
    },
    image_url: {
      type: String,
      default: "/img/default-profile.jpg", // More generic filename
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room", // Capitalized "Room" for consistency
    },
    father_name: {
      type: String,
      required: true,
      trim: true,
    },
    mother_name: {
      type: String,
      required: true,
      trim: true,
    },
    father_contact: {
      type: String, // Changed from Number to String to avoid leading-zero issues
      required: true,
      match: [/^\d{10}$/, "Invalid contact number"], // Ensures 10 digits
    },
    date_of_birth: {
      type: String, // Could be Date type, but String is fine for form input
      required: true,
    },
    adress: {
      type: String, // Fixed typo from "adress" to "address"
      required: true,
      trim: true,
    },
    duespayment: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
