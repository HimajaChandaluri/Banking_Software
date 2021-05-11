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

async function getAccountNumber() {
  const result = await AccountNumbers.findOne({ accountType: "userAccount" });
  console.log(result.accountNumber);
  return result.accountNumber;
}

async function getSavingsAccountNumber() {
  const result = await AccountNumbers.findOne({
    accountType: "savingsAccount",
  });
  console.log(result.accountNumber);
  return result.accountNumber;
}

async function getCheckingsAccountNumber() {
  const result = await AccountNumbers.findOne({
    accountType: "checkingsAccount",
  });
  console.log(result.accountNumber);
  return result.accountNumber;
}

module.exports.accountNumbersSchema = accountNumbersSchema;
module.exports.AccountNumbers = AccountNumbers;
module.exports.getAccountNumber = getAccountNumber;
module.exports.getSavingsAccountNumber = getSavingsAccountNumber;
module.exports.getCheckingsAccountNumber = getCheckingsAccountNumber;
