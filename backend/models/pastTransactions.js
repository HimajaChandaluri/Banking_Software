const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/user");

const pastTransactionSchema = new mongoose.Schema({
  senderAccount: {
    type: new mongoose.Schema({
      accountType: {
        type: String,
        required: true,
      },
      accountNumber: {
        type: Number,
        minlength: 8,
        maxlength: 9,
        required: true,
      },
      accountReference: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    }),
  },

  receiverAccount: {
    type: new mongoose.Schema({
      accountType: {
        type: String,
        required: true,
      },
      accountNumber: {
        type: Number,
        minlength: 8,
        maxlength: 9,
        required: true,
      },

      accountReference: {
        type: mongoose.Schema.Types.ObjectId,
      },
    }),
  },

  amount: {
    type: Number,
    required: true,
  },

  dateInitiatedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const PastTransaction = mongoose.model(
  "PastTransaction",
  pastTransactionSchema
);

function validatePastTransactionsInput(pastTransaction) {
  const schema = Joi.object({
    typeOfTransfer: Joi.string().required(),
    fromAccount: Joi.string().length(8).allow(""),
    toAccount: Joi.string()
      .length(8)
      .invalid(Joi.ref("fromAccount"))
      .required(),
    amount: Joi.number().positive().required(),
    frequency: Joi.string().allow(""),
    startOn: Joi.date().allow(""),
    endsOn: Joi.date().allow(""),
    routingNumber: Joi.string().length(9).allow(""),
  });

  return schema.validate(pastTransaction);
}

async function getAccountType(accountNumber) {
  if (_.isEmpty(accountNumber)) {
    return null;
  }
  let CheckingAccount = await User.findOne({
    "accounts.checkingAccount.accountNumber": accountNumber,
  });
  let SavingsAccount = await User.findOne({
    "accounts.savingAccount.accountNumber": accountNumber,
  });

  if (!_.isEmpty(CheckingAccount)) return "checkingAccount";
  else if (!_.isEmpty(SavingsAccount)) return "savingAccount";
  else return null;
}

async function getAccountDetails(accountNumber) {
  if (_.isEmpty(accountNumber)) {
    return null;
  }
  let CheckingAccount = await User.findOne({
    "accounts.checkingAccount.accountNumber": accountNumber,
  });

  let SavingsAccount = await User.findOne({
    "accounts.savingAccount.accountNumber": accountNumber,
  });

  if (!_.isEmpty(CheckingAccount)) return CheckingAccount;
  else if (!_.isEmpty(SavingsAccount)) return SavingsAccount;
  else return null;
}

module.exports.pastTransactionSchema = pastTransactionSchema;
module.exports.validate = validatePastTransactionsInput;
module.exports.getAccountType = getAccountType;
module.exports.PastTransaction = PastTransaction;
module.exports.getAccountDetails = getAccountDetails;
