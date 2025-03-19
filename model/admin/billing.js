const mongoose = require('mongoose');
const student = require('./student');
const AutoIncrement = require("mongoose-sequence")(mongoose);

const BillingInvoiceSchema = new mongoose.Schema({
    invoiceNo: { type: Number, unique: true },  // Auto-incremented Invoice Number
    invoiceDate: { type: Date, default: Date.now }, // Date of Invoice Generation
    dues:{type: Number, required: true, default:0},
    roomRent: { type: Number, required: true },  // Room Rent
    utilities: { type: Number, required: true }, // Electricity, Water Charges
    securityDeposit: { type: Number, required: true }, // One-time deposit

    totalAmount: { type: Number, required: true },  // Rent + Utilities + Deposit
    payment_month:{type: Date, required:true},
    amountPaid: { type: Number, required: true },  // Amount Paid by Student
    balanceDue: { type: Number, required: true },  // Remaining Due Amount
    student:{ type:mongoose.Schema.Types.ObjectId, ref:"Student"}, 
    createdAt: { type: Date, default: Date.now }, // Timestamp
});
BillingInvoiceSchema.plugin(AutoIncrement, { inc_field: "invoiceNo" });
 
  
module.exports = mongoose.model('BillingInvoice', BillingInvoiceSchema);
