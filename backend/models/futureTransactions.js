const mongoose = require("mongoose");

const futureTransactionSchema = new mongoose.Schema({
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

  dateToBeInitiatedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },

  typeOfPayment: {
    type: String,
    required: true,
  },
});

const FutureTransaction = mongoose.model(
  "FutureTransaction",
  futureTransactionSchema
);

module.exports.futureTransactionSchema = futureTransactionSchema;
module.exports.FutureTransaction = FutureTransaction;
