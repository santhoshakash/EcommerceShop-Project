import { Product } from "./ProductModel.js";
import { User } from "./UserModel.js";
import mongoose from "mongoose";

const discountSchema = mongoose.Schema({
  startDate: Date,
  endDate: Date,
  status: String,
  appliesTo: String,
  timeused: {
    type: Number,
    default: 0,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: Product,
        // required: ["true"],
      },
      quantity: {
        type: Number,
      },
    },
  ],
  value: Number,
  code: String,
});

discountSchema.pre('save', function (next) {
  this.populate("products.productId");

  next();
});

discountSchema.pre(/^find/, function (next) {
  this.populate("products.productId");

  next();
});
export const Coupon = mongoose.model("Coupon", discountSchema);
