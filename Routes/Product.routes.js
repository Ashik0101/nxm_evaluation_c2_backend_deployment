const express = require("express");
const { ProductModel } = require("../Models/Product.model");
const { authenticator } = require("../Middlewares/authenticate");
const { authorize } = require("../Middlewares/authorize");
const productRouter = express.Router();
productRouter.use(express.json());

//get all the products
productRouter.get("/", authenticator, (req, res) => {
  res.send("this is the products ...");
});

// addproducts
productRouter.post(
  "/addproducts",
  authenticator,
  authorize(["seller"]),
  async (req, res) => {
    const { title, price, userID } = req.body;
    try {
      const product = new ProductModel({ title, price, userID });
      await product.save();
      res.send({ msg: "Product Added successfully!" });
    } catch (err) {
      res.send({ msg: "Some error in creting the products" });
    }
  }
);

//deleteProducts
productRouter.delete(
  "/deleteproducts/:id",
  authenticator,
  authorize(["seller"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      await ProductModel.findByIdAndDelete({ _id: id });
      console.log(`product having id ${id} got deleted !!`);
      res.send({ msg: "prodct deleted!!" });
    } catch (err) {
      res.send({ msg: "Some error in deleting the products" });
    }
  }
);

module.exports = { productRouter };
