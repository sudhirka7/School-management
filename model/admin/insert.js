const mongoose = require("mongoose");
const room = require("./rooms")

// Generate 300 Students
const students = [];
for (let i = 1; i <= 30; i++) {
    for(let j = 1; j<4; j++){
        students.push({
             section: "A",  // Alternate sections
             roomNO: i, // Random room number (1-50)
             bedNo: j // Random bed number (1-5)
        });
    }    
}const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// 🏠 Room Schema (One Room has Many Students)
const RoomSchema = new Schema({
    roomNumber: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true },  // Max students allowed
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }] // Array of student IDs
});

// 👨‍🎓 Student Schema (Each Student is assigned a Room & Billing)
const StudentSchema = new Schema({
    name: { type: String, required: true },
    section: { type: String, enum: ["A", "B"], default: "A" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }, // Refers to Room
    billing: { type: mongoose.Schema.Types.ObjectId, ref: "Billing" }  // Refers to Billing
});

// 💰 Billing Schema (Linked to a Student)
const BillingSchema = new Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // Refers to Student
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    dueDate: { type: Date, required: true }
});

// Creating Models
const Room = mongoose.model("Room", RoomSchema);
const Student = mongoose.model("Student", StudentSchema);
const Billing = mongoose.model("Billing", BillingSchema);

module.exports = { Room, Student, Billing };



// Insert into Database
//   room.insertMany(students)
//     .then(() => {
//         console.log("300 Students Added Successfully!");
//         mongoose.connection.close();
//     })
//     .catch(err => console.log(err));


console.log(students);
