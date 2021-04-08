const config = require("config");

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

app.use(express.json());

// all base routes here

const port = process.env.PORT || config.get("port");
app.listen(port, () => console.log(`Listning to port ${port}.... `));
