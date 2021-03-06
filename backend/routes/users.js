const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  getAccountNumber,
  getSavingsAccountNumber,
  getCheckingsAccountNumber,
  setAccountNumber,
} = require("../models/accountNumbers");
const { User, validate } = require("../models/user");
const { PastTransaction } = require("../models/pastTransactions");
const { FutureTransaction } = require("../models/futureTransactions");

router.get("/myTransactions", auth, async (req, res) => {
  const userRef = req.user;

  const user = await User.findById(userRef._id);

  const checkingTrans = await getCheckingAccountTrans(user);
  const savingTrans = await getSavingAccountTrans(user);

  const allTrans = [{ checkingTrans: checkingTrans, savingTrans: savingTrans }];
  console.log("AllTrans: ", allTrans);

  res.send(allTrans);
});

router.get("/:id", auth, async (req, res) => {
  let user = await User.findById(req.params.id);

  res.send(user.accounts);
});

router.post("/", auth, admin, async (req, res) => {
  let accountNumber = (await getAccountNumber()) + 1;
  let savingsAccountNumber = await getSavingsAccountNumber();
  let checkingsAccountNumber = await getCheckingsAccountNumber();

  savingsAccountNumber = req.body.savingsAccount
    ? savingsAccountNumber + 1
    : savingsAccountNumber;
  checkingsAccountNumber = req.body.checkingAccount
    ? checkingsAccountNumber + 1
    : checkingsAccountNumber;

  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("Account already exists");
    }
  } catch (e) {
    console.log("ERROR");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const basicDetails = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    dateOfBirth: req.body.dateOfBirth,
    password: hashedPassword,
    address: {
      street: req.body.address,
      city: req.body.city,
      zip: req.body.zip,
      state: req.body.state,
    },
    accountNumber: accountNumber,
  };

  const hasCheckingAccount = {
    accounts: {
      checkingAccount: {
        accountNumber: checkingsAccountNumber,
      },
    },
  };

  const hasSavingAccount = {
    accounts: {
      savingAccount: {
        accountNumber: savingsAccountNumber,
      },
    },
  };

  const hasBothAccounts = {
    accounts: {
      checkingAccount: {
        accountNumber: checkingsAccountNumber,
      },
      savingAccount: {
        accountNumber: savingsAccountNumber,
      },
    },
  };

  if (req.body.checkingAccount && req.body.savingsAccount) {
    user = new User({
      ...basicDetails,
      ...hasBothAccounts,
    });
  } else if (req.body.checkingAccount)
    user = new User({ ...basicDetails, ...hasCheckingAccount });
  else user = new User({ ...basicDetails, ...hasSavingAccount });
  try {
    await user.save();
    setAccountNumber("userAccount", accountNumber);
    setAccountNumber("savingsAccount", savingsAccountNumber);
    setAccountNumber("checkingsAccount", checkingsAccountNumber);
  } catch (err) {
    console.log("ERR ", err);
    return res.status(400).send("error:", err);
  }
  res.send("Account created successfully");
});

router.delete("/", auth, admin, async (req, res) => {
  const { accountType, accountNumber } = req.body;
  console.log("DATA IN DELETE: ", req.body);
  if (accountType === "User Account") {
    let result = await User.deleteOne({ accountNumber: accountNumber });
    if (result.deletedCount) {
      res.send("Account deleted successfully");
    } else res.status(400).send("Account number does not exist");
  } else if (accountType === "Checking Account") {
    let result = await User.findOne({
      "accounts.checkingAccount.accountNumber": accountNumber,
    }).updateOne({ "accounts.checkingAccount": null });
    if (result.nModified) {
      res.send("Account deleted successfully");
    } else res.status(400).send("Account number does not exist");
  } else if (accountType === "Saving Account") {
    let result = await User.findOne({
      "accounts.savingAccount.accountNumber": accountNumber,
    }).updateOne({ "accounts.savingAccount": null });
    if (result.nModified) {
      res.send("Account deleted successfully");
    } else res.status(400).send("Account number does not exist");
  }
});

async function getCheckingAccountTrans(user) {
  let pastTransactionsArray = [];
  let futureTransactionsArray = [];
  const date = new Date();
  console.log("Before updating Date: ", date.getTime());
  // date.setDate(date.getDate() - 20);
  console.log("Before updating Date: ", date);
  date.setFullYear(date.getFullYear() - 1);
  date.setMonth(date.getMonth() - 6);
  console.log("Updated Date: ", date.getTime());

  if (user.accounts.checkingAccount) {
    for (tran of user.accounts.checkingAccount.pastTransactions) {
      console.log("ID: ", tran);
      const trans = await PastTransaction.findById(tran);
      if (trans && trans.dateInitiatedOn > date) {
        pastTransactionsArray.push(trans);
      }
    }
  }

  if (user.accounts.checkingAccount) {
    for (tran of user.accounts.checkingAccount.futureTransactions) {
      console.log("ID: ", tran);
      futureTransactionsArray.push(await FutureTransaction.findById(tran));
    }
  }

  const transactions = [
    { pastTrans: pastTransactionsArray, futureTrans: futureTransactionsArray },
  ];

  return transactions;
}

async function getSavingAccountTrans(user) {
  let pastTransactionsArray = [];
  let futureTransactionsArray = [];
  const date = new Date();
  console.log("Before updating Date: ", date);
  date.setFullYear(date.getFullYear() - 1);
  date.setMonth(date.getMonth() - 6);

  if (user.accounts.savingAccount) {
    for (tran of user.accounts.savingAccount.pastTransactions) {
      console.log("ID: ", tran);
      const trans = await PastTransaction.findById(tran);
      if (trans && trans.dateInitiatedOn > date) {
        pastTransactionsArray.push(trans);
      }
    }
  }

  if (user.accounts.savingAccount) {
    for (tran of user.accounts.savingAccount.futureTransactions) {
      console.log("ID: ", tran);
      futureTransactionsArray.push(await FutureTransaction.findById(tran));
    }
  }

  const transactions = [
    { pastTrans: pastTransactionsArray, futureTrans: futureTransactionsArray },
  ];

  return transactions;
}

module.exports = router;
