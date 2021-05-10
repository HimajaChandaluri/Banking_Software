const mongoose = require("mongoose");

const accountNumbersSchema = new mongoose.Schema({
  accountType: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
    minlength: 8,
    maxlength: 9,
  },
});

const AccountNumbers = mongoose.model("AccountNumbers", accountNumbersSchema);

module.exports.accountNumbersSchema = accountNumbersSchema;
module.exports.AccountNumbers = AccountNumbers;
