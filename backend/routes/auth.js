const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const Joi = require("Joi");

const { User } = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const result = validate(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid username or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid username or password");

    const token = user.generateAuthToken();

    res.send(token);
  } catch (er) {
    console.log("ERROR: ", er);
  }
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}

module.exports = router;
