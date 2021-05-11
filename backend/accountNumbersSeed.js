const mongoose = require("mongoose");
const config = require("config");
const { AccountNumbers } = require("./models/accountNumbers");

// To add admin data into the database for logging in
// Username : admin@admin.com
// Password : 12356

const data = [
  {
    accountType: "checkingsAccount",
    accountNumber: 30000050,
  },
  {
    accountType: "savingsAccount",
    accountNumber: 20000050,
  },
  {
    accountType: "userAccount",
    accountNumber: 10000050,
  },
];

async function seed() {
  try {
    await mongoose.connect(
      "mongodb+srv://sjsuteam6:U4vZQUPu29675Et@team6-bank-dev.dehoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );

    await AccountNumbers.deleteMany({});

    console.log("D: ", data);
    await AccountNumbers.insertMany(data);

    mongoose.disconnect();

    console.info("Done!");
  } catch (ex) {
    console.log("ERROR: ", er);
  }
}

seed();
