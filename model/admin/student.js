const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true, 
      default: function () {
        return "STU" + Date.now(); // Generates a unique student ID
      },
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    relation: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    callingNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Invalid callingNumber"],
    },
    whatAppNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Invalid WhatsApp number"],
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    joinDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      default: "/img/default-profile.jpg",
    },
    duespayment:{
      type:Number,
      default:0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
