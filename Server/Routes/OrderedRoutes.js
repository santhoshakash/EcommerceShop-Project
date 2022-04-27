import { Order } from "../Models/OrderModel.js";
import { Cart } from "../Models/CartModel.js";
import nodemailer from "nodemailer";

import express from "express";
import { User } from "../Models/UserModel.js";

const orderRouter = express.Router();

///stripe
orderRouter.post("/session", async (req, res) => {
  const sessionvalue = await createStripeCheckoutSession(req.body.line_items);
  // console.log(sessionvalue);
  return res.status(200).send({
    status: "success",
    sessionvalue,
  });
});

orderRouter.post("/addorder", async (req, res) => {
  const ordernum = await Order.find().sort({ orderno: -1 });

  const num = ordernum[0].orderno + 1;
  const productdetail = await Order.create({
    orderno: num,
    userId: req.body.userId,
    // values: req.body.values,
    info: req.body.info,
    data: req.body.data,
    fullquantity: req.body.fullquantity,
    discountedamount: req.body.discountedamount,
    discountCode: req.body.discountCode,
    totalamount: req.body.totalamount,
  });

  res.status(200).send({
    status: "success",
    productdetail,
  });
});

orderRouter.post("/updateorder", async (req, res) => {
  let obj = {
    orderno: req.body.orderno,
    userId: req.body.userId,

    info: req.body.info,
    data: req.body.data,
    fullquantity: req.body.fullquantity,
    discountedamount: req.body.discountedamount,
    discountCode: req.body.discountCode,
    totalamount: req.body.totalamount,
    // User: req.body.User,
  };

  let productdetail = await Order.findOneAndUpdate(
    { orderno: req.body.orderno },
    { $set: { ...obj } },
    { new: true }
  );

  res.status(200).send({
    status: "success",
    productdetail,
  });
});

orderRouter.post("/orderDetails", async (req, res) => {
  const orderno = req.body.orderno;
  console.log(orderno);
  if (orderno) {
    let detailorder = await Order.findOne({ orderno });
    console.log(detailorder);
    res.status(200).json({ detailorder });
  }
});

orderRouter.post("/getorderdetails", async (req, res, next) => {
  const orderid = req.body.orderid;

  const orders = await Order.findOne({ orderno: orderid });

  return res.status(200).send({
    status: "success",
    orders,
  });
});

orderRouter.post("/myorders", async (req, res, next) => {
  const userId = req.body.userId;

  const allorders = await Order.find({ userId });

  return res.status(200).send({
    status: "success",
    allorders,
  });
});

///changing the status into paid after payement success

orderRouter.post("/status", async (req, res, next) => {
  const orderno = req.body.orderno.id;
  console.log(orderno, "on");
  const status = await Order.findOneAndUpdate(
    { orderno: orderno },
    { $set: { paymentstatus: "paid" } },
    { new: true }
  );
  console.log(status);
  res.send(status);
});

////mail
orderRouter.post("/email", async (req, res) => {
  const messages = req.body.message;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USERNAME,
      pass: process.env.PASSWORD,
    },
  });
  const message = {
    from: "santhoshakash1145@gmail.com",
    to: "vjba1999@gmail.com",
    subject: "hellow vijayabalaji",
    html: messages,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    }
  });
});

export default orderRouter;
