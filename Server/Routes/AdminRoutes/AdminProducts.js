import path from "path";
import express from "express";
import multer from "multer";
import sharp from "sharp";
import { Product } from "../../Models/ProductModel.js";
import { Order } from "../../Models/OrderModel.js";
import { Coupon } from "../../Models/DiscountModel.js";
import products from "../../../my-react/src/userApi/Product.js";

// import fs from "../../../my-react/public/images";
const adminRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "../my-react/public/images");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  //   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

adminRouter.post("/addimage", upload.single("images"), async (req, res) => {
  return res.send(`/images/${req.file.filename}`);
  //   res.send(`/${req.file.path}`);
});

adminRouter.post("/addproduct", async (req, res) => {
  try {
    const product = await Product.create(req.body.products);

    return res.status(200).send({
      status: "success",
      product,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Something wrong",
    });
  }
});

adminRouter.post("/updateproduct", async (req, res, next) => {
  const request = req.body.products1;

  try {
    const product = await Product.findByIdAndUpdate(
      {
        _id: request.id,
      },
      {
        $set: { ...request },
      },
      { new: true }
    );
    if (!product) {
      return res.status(500).send({ meassge: "No product found with that ID" });
    } else {
      return res.status(200).send({
        status: "success",
        product,
      });
    }
  } catch (error) {
    res.status(404).send("sku already exists");
  }
});

adminRouter.get("/getallproducts", async (req, res, next) => {
  const products = await Product.find({});
  res.json(products);
});

adminRouter.get("/getallorders", async (req, res, next) => {
  const products = await Order.find();

  return res.status(200).send({
    products,
  });
});

adminRouter.post("/getorderdetails", async (req, res, next) => {
  const orderid = req.body.orderid;

  const orders = await Order.findOne({ orderno: orderid });

  return res.status(200).send({
    status: "success",
    orders,
  });
});

adminRouter.post("/numberoforder", async (req, res, next) => {
  const Id = req.body.userId;

  const numoforders = await Order.find({
    userId: Id,
    // paymentstatus: "paid",
  }).count();

  return res.status(200).send({
    status: "success",
    numoforders,
  });
});

adminRouter.get("/getalldiscount", async (req, res, next) => {
  const discounts = await Coupon.find();

  return res.status(200).send({
    status: "success",
    discounts,
  });
});

//editdiscounts

adminRouter.post("/updatediscounts", async (req, res) => {
  const currentcoupon = req.body.couponId;

  const CurrentCoupon = await Coupon.findByIdAndUpdate(
    { _id: currentcoupon },
    { $set: { ...req.body.object } },
    { new: true }
  );
});

//getonecoupon

adminRouter.post("/onecoupondetails", async (req, res) => {
  const oneCouponDetails = await Coupon.findOne({ _id: req.body.id });

  res.status(200).send(oneCouponDetails);
});

//delete discounts

adminRouter.post("/deletediscount", async (req, res, next) => {
  const deletedata = await Coupon.deleteOne({
    _id: req.body.id,
  });

  return res.status(200).send({
    status: "success",
    deletedata,
  });
});

adminRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    // res.status(404).send("Failed to fetch product")
    throw new Error("Product not found");
  }
});

export default adminRouter;
