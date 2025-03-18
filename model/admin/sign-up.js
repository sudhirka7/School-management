const mongoose =require("mongoose");
const Schema = mongoose.Schema;

const signSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type : String,
        requied: true,
    }
})

module.exports = mongoose.model("Admin", signSchema);