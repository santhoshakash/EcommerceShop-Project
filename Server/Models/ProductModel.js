// import isEmail from "validator/lib/isEmail";
import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // require: true,
    },
    images: {
      type: String,
      // require: true,
    },
    description: {
      type: String,
      // require: true,
    },
    price: {
      type: Number,
      // required: true,
      // default: 0,
    },
    sku: {
      type: String,
      // required: true,
      unique: [true, "provide a unique sku"],
    },
    Stock: {
      type: Number,
      // required: true,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
