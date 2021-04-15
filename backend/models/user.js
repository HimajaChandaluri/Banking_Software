const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },

  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    minlength: 5,
    malength: 255,
    unique: true,
  },

  phoneNumber: {
    type: Number,
    required: true,
    minlength: 10,
    maxlength: 12,
    unique: true,
  },

  dateOfBirth: {
    type: Date,
    required: true,
  },

  address: {
    type: new mongoose.Schema({
      street: {
        type: String,
        reqiired: true,
        minlength: 5,
        maxlength: 500,
      },

      city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
      },

      state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
      },

      zip: {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 10,
      },
    }),
    required: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  accountNumber: {
    type: Number,
    unique: true,
    minlength: 8,
    maxlength: 9,
  },

  accounts: {
    type: new mongoose.Schema({
      savingAccount: new mongoose.Schema({
        accountNumber: {
          type: Number,
          minlength: 8,
          maxlength: 9,
          sparse: true,
        },

        balance: {
          type: Number,
          default: 100,
        },

        pastTransactions: {
          type: [mongoose.Schema.Types.ObjectId],
        },

        futureTransactions: {
          type: [mongoose.Schema.Types.ObjectId],
        },
      }),

      checkingAccount: new mongoose.Schema({
        accountNumber: {
          type: Number,
          minlength: 8,
          maxlength: 9,
          sparse: true,
        },

        balance: {
          type: Number,
          default: 100,
        },

        pastTransactions: {
          type: [mongoose.Schema.Types.ObjectId],
        },

        futureTransactions: {
          type: [mongoose.Schema.Types.ObjectId],
        },
      }),
    }),
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUserInput(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().regex(/^\d+$/).length(10).required(),

    dateOfBirth: Joi.date().required(),
    address: Joi.string().min(5).max(500).required(),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().min(2).max(100).required(),
    zip: Joi.string().regex(/^\d+$/).length(5).required(),
    password: Joi.string().min(6).required(),
    savingsAccount: Joi.boolean(),
    checkingAccount: Joi.boolean(),
  });

  return schema.validate(user);
}

function getAccountNumbers() {
  const fileData = fs.readFileSync(__dirname + "/AccountNumber.json", "utf8");
  const accNumData = JSON.parse(fileData);
  return accNumData;
}

function setAccountNumbers(
  accountNumber,
  savingsAccountNumber,
  checkingsAccountNumber
) {
  const customerAccountDetails = {
    accountNumber: accountNumber,
    savingsAccountNumber: savingsAccountNumber,
    checkingsAccountNumber: checkingsAccountNumber,
  };

  const jsonString = JSON.stringify(customerAccountDetails);
  try {
    fs.writeFileSync(__dirname + "/AccountNumber.json", jsonString);
  } catch (err) {
    console.log("Error writing file", err);
  }
}

module.exports.userSchema = userSchema;
module.exports.validate = validateUserInput;
module.exports.User = User;
module.exports.getAccountNumbers = getAccountNumbers;
module.exports.setAccountNumbers = setAccountNumbers;
