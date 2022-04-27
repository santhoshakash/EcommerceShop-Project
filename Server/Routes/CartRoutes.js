import { Cart } from "../Models/CartModel.js";
import { Product } from "../Models/ProductModel.js";
import express from "express";
const cartRoute = express.Router();

// remove all cart after payement sucess

cartRoute.post("/removecart", async (req, res, next) => {
  const updated = await Cart.deleteOne(
    { userId: req.body.userId },
    { $set: { product: [] } }
  );

  return res.status(200).send({
    status: "success",
    updated,
  });
});

///delete particular product cart

cartRoute.post("/deletedocumentcart", async (req, res) => {
  const cart = await Cart.deleteOne({ userId: req.body.userId });

  res.status(200).send(cart);
});

////updates the cart

cartRoute.post("/cartUpdates", async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.body.userId },
    {
      $set: { products: req.body.products },
    },
    { new: true }
  );

  res.send(cart);
});

// getting the cart for particular users

cartRoute.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    let cart = await Cart.findOne({ userId: userId });
    if (cart === null) {
      res.status(201).send([]);
      return;
    }
    if (cart) {
      if (cart && cart.products.length > 0) {
        res.status(200).send(cart);
      } else {
        res.status(201).send(cart.products);
      }
    } else {
      const newCart = await Cart.create({
        userId,
        products: [],
        bill: 0,
      });
    }
  } catch (err) {
    // else { res.send("hi") }

    res.status(500).send("Something went Wrong!");
  }
});

// adding products to cart
cartRoute.post("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId, quantity });
    let product = await Product.findOne({ _id: productId });

    if (!product) {
      res.status(404).send("Product not found!");
    }
    let price = product.price;

    if (cart) {
      // if cart exists for user
      let productIndex = cart.products.findIndex(
        (p) => p.productId.sku === product.sku
      );

      // Check if product exists or not
      if (productIndex > -1) {
        let productItem = cart.products[productIndex];

        const checkInventory =
          productItem.quantity < productItem.productId.Stock;

        if (checkInventory) {
          productItem.quantity = productItem.quantity * 1 + quantity * 1;

          cart.products[productIndex] = productItem;
        } else {
          return res.status(201).send(cart);
        }
        // let productItem.quantity   = productItem.quantity *1
      } else {
        cart.products.push({ productId, quantity, price });
      }

      cart.bill = cart.bill * 1 + quantity * 1 * (price * 1);

      cart = await cart.save();

      return res.status(201).send(cart);
    } else {
      // no cart exists, createone

      const newCart = await Cart.create({
        userId,
        products: [{ productId, quantity, price }],
        bill: quantity * price,
      });

      return res.status(201).send(newCart);
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// updating individual cart products

cartRoute.put("/:userId", async (req, res) => {
  const userId = req.params.userId;

  const { sku, qty } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    let product = await Product.findOne({ sku: sku });

    if (!product) return res.status(404).send("Product not Found!");
    if (!cart) return res.status(400).send("Cart not Found!");
    else {
      let productIndex = cart.products.findIndex(
        (p) => p.productId.sku === sku
      );

      // check if products exists or not
      if (productIndex == -1)
        return res.status(404).send("Product not found in the cart!");
      else {
        let productItem = cart.products[productIndex];

        if (productItem.quantity === qty) {
          return res.status(200).send(cart);
        }
        if (qty === 0) {
          return res.status(404).send("Invalid Cart Quantity");
        }

        productItem.quantity = qty;

        cart.products[productIndex] = productItem;
      }

      const pricevar = cart.products.map((p) => p.productId.price * p.quantity);

      let sums = pricevar.reduce((partialSum, a) => partialSum + a, 0);

      cart.bill = 0;
      cart.bill = sums + cart.bill;

      cart = await cart.save();
      return res.status(201).send(cart);
    }
  } catch (error) {
    res.status(500).send("Something Went went wrong ;(");
  }
});

///remove the cart
cartRoute.delete("/:userId/:_id", async (req, res) => {
  const userId = req.params.userId;
  const _id = req.params._id;

  try {
    let cart = await Cart.findOne({ userId });

    let productIndex = cart.products.findIndex((p) => p.productId._id == _id);
    if (productIndex > -1) {
      let productItem = cart.products[productIndex];

      cart.bill =
        cart.bill - productItem.quantity * productItem.productId.price;

      cart.products.splice(productIndex, 1);
    }
    cart = await cart.save();

    return res.status(201).send(cart);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

///remove the allcart after payement

export default cartRoute;
