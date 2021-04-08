const mongoose = require("mongoose");

const futureTransactionSchema = new mongoose.Schema({
  senderAccount: {
    type: new mongoose.Schema({
      accountType: {
        type: String,
        required: true,
      },

      accountReference: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    }),
    required: true,
  },

  receiverAccount: {
    type: new mongoose.Schema({
      accountType: {
        type: String,
        required: true,
      },

      accountReference: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    }),
    required: true,
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
  futureTransactionsSchema
);

function validateFutureTransactionsInput(futureTransaction) {
  const schema = Joi.object({
    // validations here
  });

  return schema.validate(futureTransaction);
}

module.exports.futureTransactionSchema = futureTransactionSchema;
module.exports.validate = validateFutureTransactionsInput;
module.exports.FutureTransaction = FutureTransaction;
