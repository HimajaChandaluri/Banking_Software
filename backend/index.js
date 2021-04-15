const config = require("config");
const users = require("./routes/users");
const auth = require("./routes/auth");
var cors = require("cors");

const express = require("express");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/teamSixBank", {
    // retry to connect for 60 times
    reconnectTries: 1,
    // wait 1 second before retrying
    reconnectInterval: 1000,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("Unable to connect to database "));

app.use(cors());
app.use(express.json());

app.use("/api/user", users);
app.use("/api/auth", auth);

// all base routes here

const port = process.env.PORT || config.get("port");
app.listen(port, () => console.log(`Listning to port ${port}.... `));
