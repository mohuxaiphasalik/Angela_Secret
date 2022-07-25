//
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//
// mongo Database
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({ email: String, password: String });
userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});
const User = mongoose.model("User", userSchema);
//
//
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
//
//
// post
app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.userName,
    password: req.body.password,
  });
  newUser.save(function (err) {
    if (!err) {
      res.render("secrets");
    }
  });
});
app.post("/login", function (req, res) {
  const email = req.body.userName;
  const password = req.body.password;
  User.findOne({ email: email }, function (err, foundUser) {
    if (!err) {
      if (foundUser) {
        console.log(foundUser);
        if (foundUser.password === password) {
          res.render("secrets");
        }
      } else {
        console.log("No  User Found");
      }
    } else {
      console.log(err);
    }
  });
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});