const mongoose = require('mongoose');
const Student = require("./student.js");


const roomSchema = new mongoose.Schema({
    hostel_name:{
        type: String,
    },
    section:{
        type:String, enum:["A", "B"], default: "A",
    },
    roomNo:{
        type:Number,
        required:true,
    },
    bedNo:{
        type:String
    },
    status:{
        type:String, enum:["T","F"], default: "F",
    },
    


});

module.exports = mongoose.model("room",roomSchema);