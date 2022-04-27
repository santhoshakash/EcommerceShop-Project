import { Product } from "../Models/ProductModel.js";
import asyncHandler from "express-async-handler";
import express from "express";
const productRoute = express.Router();

// getting all products
productRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find({ status: "available" });
    res.json(products);
  })
);

productRoute.post(
  "/inventorydecrement",
  asyncHandler(async (req, res) => {
    const productId = req.body.productId;
    console.log(productId, "/");
    const quantity = req.body.quantity;
    console.log(productId, quantity);
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { $inc: { Stock: -quantity } },
      { new: true }
    );
    console.log(product);
    res.status(200).send(product);
  })
);

productRoute.post(
  "/inventoryincrement",
  asyncHandler(async (req, res) => {
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    console.log(productId, quantity);
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { $inc: { Stock: quantity } },
      { new: true }
    );
    console.log(product);
    res.status(200).send(product);
  })
);

// getting single product
productRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    console.log(req.params.id, "////////");
    const product = await Product.findById(req.params.id);
    console.log(product);
    if (product) {
      res.json(product);
    } else {
      throw new Error("Product not found");
    }
  })
);

// get by sku
productRoute.get(
  "/check/:id",
  asyncHandler(async (req, res) => {
    console.log(req.params.id, "////,.,.");
    const product = await Product.findOne({ sku: req.params.id });
    console.log(product);
    if (product) {
      res.json(product);
    } else {
      throw new Error("Product not found");
    }
  })
);
export default productRoute;
