const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:{type:String,required:true},
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
}, { timestamps: true });
const Banks = mongoose.model('BankAccounts', BankAccountSchema,'BankAccounts');
module.exports = Banks;
