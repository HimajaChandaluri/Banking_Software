const mongoose = require("mongoose");
const config = require("config");

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
    minlength: 5,
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
          unique: true,
          minlength: 8,
          maxlength: 9,
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
          unique: true,
          minlength: 8,
          maxlength: 9,
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
    // validations here
  });

  return schema.validate(user);
}

module.exports.userSchema = userSchema;
module.exports.validate = validateUserInput;
module.exports.User = User;
