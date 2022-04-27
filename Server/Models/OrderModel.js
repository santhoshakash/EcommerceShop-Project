import { User } from "./UserModel.js";
import mongoose from "mongoose";
import { Product } from "./ProductModel.js";
// import isEmail from "validator/lib/isEmail";

const orderSchema = new mongoose.Schema({
  orderno: {
    type: Number,
    // required: [true],
    unique: [true, , "OrderNo already exist"],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // unique: true,
  },
  info: {
    type: Object,
  },

  amount: {
    type: String,
  },
  totaldiscount: {
    type: Number,
  },
  paymentstatus: {
    type: String,
    default: "pending",
  },
  createdate: {
    type: Date,
    default: Date.now,
  },
  fulfilmentstatus: {
    type: String,
    default: "UnFullfilled",
  },
  fullquantity: {
    type: Number,
  },
  discountedamount: {
    type: Number,
  },
  discountCode: {
    type: String,
  },
  totalamount: {
    type: Number,
  },
  data: {
    type: Object,
  },
});

orderSchema.pre("save", async function (next) {
  this.populate("userId");
  next();
});
orderSchema.pre(/^find/, function (next) {
  this.populate("userId");
  // this.populate("discount.couponId");
  next();
});

export const Order = mongoose.model("Order", orderSchema);

// export const Order = mongoose.model("Order", orderSchema);
