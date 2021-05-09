const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const auth = require("../middleware/auth");
const {
  PastTransaction,
  validate,
  getAccountType,
  getAccountDetails,
} = require("../models/pastTransactions");
const { User } = require("../models/user");
const { FutureTransaction } = require("../models/futureTransactions");

const externalTransfer = "Transfer to an account in other bank";
const oneTimeTransfer = "One time immediately";
const deposit = "Deposit money";
const internalTransfer = "Transfer to someone within a bank";
const transferBetweenMyAccounts = "Transfer between my accounts";

router.post("/", auth, async (req, res) => {
  const result = validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  let senderAccountType = await getAccountType(req.body.fromAccount);
  let receiverAccountType = await getAccountType(req.body.toAccount);
  const senderAccountDetails = await getAccountDetails(req.body.fromAccount);
  const receiverAccountDetails = await getAccountDetails(req.body.toAccount);

  if (
    receiverAccountType === null &&
    req.body.typeOfTransfer !== externalTransfer
  ) {
    return res.status(400).send("Invalid Receiver account number");
  }

  if (
    senderAccountDetails &&
    senderAccountDetails.accounts[senderAccountType].balance < req.body.amount
  ) {
    return res.status(400).send("Insufficient funds");
  }

  if (
    req.body.typeOfTransfer === internalTransfer ||
    req.body.typeOfTransfer === transferBetweenMyAccounts
  ) {
    if (req.body.frequency === oneTimeTransfer) {
      senderAccountDetails.accounts[senderAccountType].balance =
        senderAccountDetails.accounts[senderAccountType].balance -
        parseInt(req.body.amount);

      receiverAccountDetails.accounts[receiverAccountType].balance =
        receiverAccountDetails.accounts[receiverAccountType].balance +
        parseInt(req.body.amount);

      currentTransaction = new PastTransaction({
        senderAccount: {
          accountType: senderAccountType,
          accountNumber: req.body.fromAccount,
          accountReference: senderAccountDetails._id,
        },
        receiverAccount: {
          accountType: receiverAccountType,
          accountNumber: req.body.toAccount,
          accountReference: receiverAccountDetails._id,
        },
        amount: req.body.amount,
      });

      try {
        await senderAccountDetails.save();
        await receiverAccountDetails.save();
        const result = await currentTransaction.save();
        senderAccountDetails.accounts[senderAccountType].pastTransactions.push(
          result._id
        );
        receiverAccountDetails.accounts[
          receiverAccountType
        ].pastTransactions.push(result._id);
        await senderAccountDetails.save();
        await receiverAccountDetails.save();
        res.send("Transferred successfully");
      } catch (err) {
        return res.status(400).send("error:", err);
      }
    } else {
      futureTransaction = new FutureTransaction({
        senderAccount: {
          accountType: senderAccountType,
          accountNumber: req.body.fromAccount,
          accountReference: senderAccountDetails._id,
        },
        receiverAccount: {
          accountType: receiverAccountType,
          accountNumber: req.body.toAccount,
          accountReference: receiverAccountDetails._id,
        },
        amount: req.body.amount,
        dateInitiatedOn: req.body.startOn,
        typeOfPayment: req.body.frequency,
      });

      try {
        const result = await futureTransaction.save();
        senderAccountDetails.accounts[
          senderAccountType
        ].futureTransactions.push(result._id);
        receiverAccountDetails.accounts[
          receiverAccountType
        ].futureTransactions.push(result._id);
        await senderAccountDetails.save();
        await receiverAccountDetails.save();
        res.send("Scheduled your transfer successfully");
      } catch (err) {
        return res.status(400).send("error:", err);
      }
    }
  } else if (req.body.typeOfTransfer === externalTransfer) {
    if (req.body.frequency === oneTimeTransfer) {
      senderAccountDetails.accounts[senderAccountType].balance =
        senderAccountDetails.accounts[senderAccountType].balance -
        parseInt(req.body.amount);

      currentTransaction = new PastTransaction({
        senderAccount: {
          accountType: senderAccountType,
          accountNumber: req.body.fromAccount,
          accountReference: senderAccountDetails._id,
        },
        receiverAccount: {
          accountType: "external",
          accountNumber: req.body.toAccount,
        },
        amount: req.body.amount,
      });

      try {
        await senderAccountDetails.save();
        const result = await currentTransaction.save();
        senderAccountDetails.accounts[senderAccountType].pastTransactions.push(
          result._id
        );
        await senderAccountDetails.save();
        res.send("Transferred successfully");
      } catch (err) {
        console.log("ERR ", err);
        return res.status(400).send("error:", err);
      }
    } else {
      futureTransaction = new FutureTransaction({
        senderAccount: {
          accountType: senderAccountType,
          accountNumber: req.body.fromAccount,
          accountReference: senderAccountDetails._id,
        },
        receiverAccount: {
          accountType: "external",
          accountNumber: req.body.toAccount,
        },
        amount: req.body.amount,
        dateInitiatedOn: req.body.startOn,
        typeOfPayment: req.body.frequency,
      });

      try {
        const result = await futureTransaction.save();
        senderAccountDetails.accounts[
          senderAccountType
        ].futureTransactions.push(result._id);
        await senderAccountDetails.save();
        res.send("Scheduled your transfer successfully");
      } catch (err) {
        console.log("ERR ", err);
        return res.status(400).send("error:", err);
      }
    }
  } else {
    receiverAccountDetails.accounts[receiverAccountType].balance =
      receiverAccountDetails.accounts[receiverAccountType].balance +
      parseInt(req.body.amount);

    currentTransaction = new PastTransaction({
      receiverAccount: {
        accountType: receiverAccountType,
        accountNumber: req.body.toAccount,
        accountReference: receiverAccountDetails._id,
      },
      amount: req.body.amount,
    });
    try {
      await receiverAccountDetails.save();
      const result = await currentTransaction.save();
      receiverAccountDetails.accounts[
        receiverAccountType
      ].pastTransactions.push(result._id);
      await receiverAccountDetails.save();
      res.send("Transferred successfully");
    } catch (err) {
      console.log("ERR ", err);
      return res.status(400).send("error:", err);
    }
  }
});

module.exports = router;
