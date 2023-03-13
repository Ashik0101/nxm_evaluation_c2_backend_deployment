const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserModel } = require("../Models/User.model");
const { BlacklistModel } = require("../Models/Blacklist.model");
const authenticator = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (token) {
      const isTokenBL = await BlacklistModel.find({ token });
      if (isTokenBL.length) {
        return res.send({ msg: "Token is Blacklisted !!!" });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded) {
        const id = decoded.userID;
        req.body.userID = id;
        const user = await UserModel.find({ _id: id });
        req.user = user[0];
        next();
      }
    } else {
      res.send({ msg: "You are not authorized from authenticator mw" });
    }
  } catch (err) {
    res.send({ msg: "Some error fro authenticator mw" });
    console.log("errror :", err);
  }
};

module.exports = { authenticator };
