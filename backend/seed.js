const { User } = require("./models/user");
const mongoose = require("mongoose");
const config = require("config");

// To add admin data into the database for logging in
// Username : admin@admin.com
// Password : 12356

const admin = {
  isAdmin: true,
  firstName: "admin",
  lastName: "admin",
  email: "admin@admin.com",
  phoneNumber: 1234567890,
  dateOfBirth: "2021-04-15",
  password: "$2b$10$6Yfl5jhiHGirhaf/MOaO3.Qw2y5yoymLCIxclLVTRaG2YMCJk14L6",
  address: {
    street: "ABC Street",
    city: "AB",
    zip: 12345,
    state: "Alabama",
  },
};

async function seed() {
  try {
    await mongoose.connect("mongodb://localhost/teamSixBank");

    await User.deleteMany({});

    const user = new User(admin);
    await user.save();

    mongoose.disconnect();

    console.info("Done!");
  } catch (ex) {
    console.log("ERROR: ", er);
  }
}

seed();
