const express = require("express");
const { connection } = require("./config/db");
require("dotenv").config();
const { userRouter } = require("./Routes/User.routes");
const { productRouter } = require("./Routes/Product.routes");

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/products", productRouter);
app.listen(process.env.port, async (req, res) => {
  try {
    await connection;
    console.log("Connected to DB!!");
    console.log(`Server is listening at ${process.env.port} !`);
  } catch (err) {
    console.log("Error connecting to DB!!");
  }
});
