const mongodb = require("mongoose");

const Admin = new mongodb.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
       
    },
    password:{
        type: String,
        required: true,
    },
    
});

module.exports = mongodb.model("Admin", Admin);