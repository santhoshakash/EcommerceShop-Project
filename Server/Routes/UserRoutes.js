// import { Product } from "../Models/ProductModel.js";
import { User } from "../Models/UserModel.js";
import asyncHandler from "express-async-handler";
import { MongoClient } from "mongodb";

import express from "express";
import { generateToken } from "../utils/generateToken.js";
import { protect } from "../MiddleWare/AuthMiddleware.js";
const userRouter = express.Router();

userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      req.session.user = user;

      res.json({
        _id: user._id,

        email: user.email,
        Admin: user.Admin,
        token: generateToken(user._id),
        createdAt: user.createdAt,
        loggedIn: true,
      });
    } else {
      res.status(401);

      res.send("Invalid Email or Password");
    }
  })
);

// for profile
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        Admin: user.Admin,
        // createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("No User found");
    }
    res.send("User Profile");
  })
);

userRouter.post(
  "/logout",
  asyncHandler(async (req, res) => {
    console.log("hiii");
    MongoClient.connect(process.env.MONGO_URL, function (err, client) {
      if (err) console.log(err);
      let db = client.db("myFirstDatabase");
      if (req.session && req.session.user) {
        const datas = db
          .collection("session")
          .deleteOne({ _id: req.session.user._id });
      }
      req.session.destroy(() => {
        res
          .clearCookie("userId", {
            path: "/",
            httpOnly: true,
          })
          .sendStatus(200);
      });
    });
  })
);

userRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("jcfgbhjklkjnhbg", req.body);

    const userExists = await User.findOne({ email });
    console.log(userExists, ";---");

    if (userExists) {
      console.log("UE kula");
      res.status(400);
      // res.status(400).send("user exist");
      throw new Error("User already exists");
    }
    console.log("hii1");
    const user = await User.create({
      email,
      password,
    });
    console.log("hii2");

    if (user) {
      console.log("hii3");

      res.status(201).json({
        _id: user._id,

        email: user.email,
        Admin: user.Admin,
        // token: generateToken(user._id),
      });
    } else {
      console.log("hii4");

      res.status(400);
      throw new Error("Invalid User Data");
    }
    console.log("hii5");
  })
);
export default userRouter;
