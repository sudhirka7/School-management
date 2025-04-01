const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const billingSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // References the Student model
      required: true,
    },
     
    balanceDue:{
        type:Number,
        required:true,
    },
    admission:{
        type:Number,
        required:true,
    },
    tuition:{
        type:Number,
        required:true,
    },
    other: {
      type: Number,
      required: true,
    },
    securityDeposit: {
        type: Number,
        required: true,
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
  },
   
    payment_month: {
      type: String,
      required:true,
    },
    invoice: { type: Number, unique: true },
     
  },
  { timestamps: true }
);
billingSchema.plugin(AutoIncrement, { inc_field: "invoice" });
module.exports = mongoose.model("Billing", billingSchema);
