//jWt
const jwt = require("jsonwebtoken");
//bcrypt
const bcrypt = require("bcryptjs");
//model
const model = require("../Model/model");
//router
const express = require("express");

const router = express.Router();


//Register
router.post("/register", async (req, res) => {
  try {
    let existinguser = await model.findOne({ email: req.body.email });
    if (existinguser) {
      return res.status(400).json("user already exist in DB");
    }
    let hash = await bcrypt.hash(req.body.password, 10);
    const data2 = new model({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    const data3 = await data2.save();
    res.json(data3);
  } catch (err) {
    res.status(400).json(err);
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const userpassword = await model.findOne({ email: req.body.email });
    if (!userpassword) {
      return res.status(400).json("Email not exist in DB");
    }

    const validpassword = await bcrypt.compare(
      req.body.password,
      userpassword.password
    );

    if (!validpassword) {
      return res.status(400).json("Password not valid");
    }

    const webtoken = await jwt.sign({ email: userpassword.email }, "Rakhan"); //secret key ,its like a ID card

    res.header("auth", webtoken).send(webtoken);
  } catch (err) {
    res.status(400).json(err);
  }
});

const validateuser = (req, res, next) => {
  var token = req.header("auth");
  req.token = token;
  next();
};

router.get("/get", validateuser, async (req, res) => {
  jwt.verify(req.token, "Rakhan", async (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const data2 = await model.find().select(['-password']);
      res.json(data2);
    }
  });
});
module.exports = router;
