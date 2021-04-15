const mongoose = require("mongoose");

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
      accountNumber: {
        type: Number,
        minlength: 8,
        maxlength: 9,
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

  dateInitiatedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const PastTransaction = mongoose.model(
  "PastTransaction",
  pastTransactionsSchema
);

function validatePastTransactionsInput(pastTransaction) {
  const schema = Joi.object({
    // validations here
  });

  return schema.validate(pastTransaction);
}

module.exports.pastTransactionSchema = pastTransactionSchema;
module.exports.validate = validatePastTransactionsInput;
module.exports.PastTransaction = PastTransaction;
