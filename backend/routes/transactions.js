const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  res.send(req.body);
});

module.exports = router;
