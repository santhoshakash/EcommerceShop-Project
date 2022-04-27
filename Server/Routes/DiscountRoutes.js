import { Cart } from "../Models/CartModel.js";
import { Coupon } from "../Models/DiscountModel.js";
import express from "express";
// import { useParams } from "react-router";
const discountRoute = express.Router();

discountRoute.post("/add", async (req, res) => {
  const discountdetails = req.body;

  try {
    const newDiscount = await Coupon.create({ ...req.body });

    res.status(200).send(newDiscount);
  } catch (error) {


    res.status(404).send("Somethig wrong ");
  }
});

discountRoute.post("/verify", async (req, res) => {
  const { cartData } = req.body;
  const coupon = cartData.couponCode;
  const userId = cartData.userId;
  let cart = await Cart.findOne({ userId });

  const CurrentCoupon = await Coupon.findOne({ code: coupon });
  if (CurrentCoupon) {
    let couponId = CurrentCoupon._id.toString();
    let couponCode = CurrentCoupon.code;
    if (CurrentCoupon.status === "enable") {
      if (
        new Date().getTime() > CurrentCoupon.startDate.getTime() &&
        new Date().getTime() < CurrentCoupon.endDate.getTime()
      ) {
        cart.discount.push({ couponId });
        console.log(couponCode);
        cart.couponCode = couponCode;
        cart = await cart.save();
      } else {
        console.log("Coupon is already expired....");
      }
    } else {
      console.log("coupon is not enabled");
    }
  } else {
    console.log("Coupon not found");
  }
  res.status(200).send(CurrentCoupon);
});

discountRoute.delete("/removecoupon/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    let cart = await Cart.findOne({ userId });

    cart.discount = [];
    cart.couponCode = "";

    cart = await cart.save();

    const discountdetails = {
      isDiscounted: false,
      discount: 0,
      message: "Discount Coupon was removed",
    };
    return res.status(201).send(discountdetails);
  } catch (error) {
    console.log(error);
    res.status(500).send("Coupon cannot be removed,something went wrong");
  }
});
// update the discounts with id in admin side
discountRoute.post("/updatediscounts", async (req, res) => {
  const currentcoupon = req.body.couponId;

  const CurrentCoupon = await Coupon.findByIdAndUpdate(
    { _id: currentcoupon },
    { $set: { ...req.body.object } },
    { new: true }
  );
});

// admin discounts list api
discountRoute.post("/discountlists", async (req, res) => {
  const discountDetails = await Coupon.find();
  res.status(200).send(discountDetails);
});

// get single coupon details
discountRoute.post("/onecoupondetails", async (req, res) => {
  const singleCouponDetails = await Coupon.findOne({ _id: req.body.id });
  res.status(200).send(singleCouponDetails);
});

discountRoute.post("/increment", async (req, res) => {
  const couponCode = req.body.code;

  let discountDetails = await Coupon.findOneAndUpdate(
    { code: couponCode },
    { $inc: { timeused: 1 } },
    { new: true }
  );

  res.send(discountDetails);
});

discountRoute.post("/discheck", async (req, res) => {
  const coupon1 = await Coupon.findOne({ code: req.body.code });

  res.send(coupon1);
});

export default discountRoute;
