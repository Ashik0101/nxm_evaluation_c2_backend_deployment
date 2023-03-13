const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie_parser = require("cookie-parser");
const { UserModel } = require("../Models/User.model");
const { BlacklistModel } = require("../Models/Blacklist.model");
const userRouter = express.Router();
userRouter.use(express.json());
userRouter.use(cookie_parser());
//signup part
userRouter.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length) {
      res.send({ msg: "User Already Registered...Login now..." });
    } else {
      bcrypt.hash(password, 5, (err, encrypted) => {
        if (encrypted) {
          const user = new UserModel({
            name,
            email,
            role,
            password: encrypted,
          });
          user.save();
          res.send({ msg: "User Registered Successfully !" });
        } else {
          res.send({ msg: "Some Error while hashing the password" });
        }
      });
    }
  } catch (err) {
    res.send({ msg: "Some error while creating the user !" });
    console.log("some error creating the user :", err);
  }
});

//login part is here
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (!user.length) {
      res.send({ msg: "User not found Plese register first" });
    } else {
      bcrypt.compare(password, user[0].password, (err, same) => {
        if (same) {
          const token = jwt.sign(
            { userID: user[0]._id },
            process.env.SECRET_KEY,
            {
              expiresIn: "1m",
            }
          );

          const refresh_token = jwt.sign(
            { userID: user[0]._id },
            process.env.REFRESH_SECRET_KEY,
            {
              expiresIn: "5m",
            }
          );
          res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
          });
          if (token) {
            res.send({ msg: "Login Successfull", token, refresh_token });
          }
        } else {
          res.send({ msg: "Invalid Credentials !" });
        }
      });
    }
  } catch (err) {
    res.send({ msg: "Some error in login part " });
    console.log("soem error in login part :", err);
  }
});

//logout part is here
userRouter.post("/logout", async (req, res) => {
  const { token } = req.body;
  try {
    const data = new BlacklistModel({ token });
    await data.save();
    res.send({ msg: "Logout Successfull Or token Blacklisted" });
  } catch (err) {
    res.send({ msg: "Some errror whoile logout!!" });
    console.log("Some error while logout :", err);
  }
});
module.exports = { userRouter };
