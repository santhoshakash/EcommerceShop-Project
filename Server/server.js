// import { errorHandler, notFound } from "./MiddleWare/Errors.js";

// import ImportData from "./DataImport.js";
// const bodyParser = require("body-parser");
import bodyParser from "body-parser";

import { connectDatabase } from "./config/MongoDb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { default as connectMongoDBSession } from "connect-mongodb-session";

import userRouter from "./Routes/UserRoutes.js";
import productRouter from "./Routes/ProductRoutes.js";
import session from "express-session";
import cartRouter from "./Routes/CartRoutes.js";
import discountRoute from "./Routes/DiscountRoutes.js";
import orderRouter from "./Routes/OrderedRoutes.js";
import payementRouter from "./Routes/PaymentRoutes.js";
// import { uploadUserPhoto } from "../Server/Routes/AdminRoutes/AdminProducts.js";
import adminRouter from "../Server/Routes/AdminRoutes/AdminProducts.js";
const MongoDBStore = connectMongoDBSession(session);

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

var store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "session",
  expires: 1000 * 60 * 60 * 24 * 30,
});

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false,
    },
    store: store,
  })
);
connectDatabase();
// API
// app.use("/api/import", ImportData);
app.get("/user/sessions", (req, res) => {
  console.log(req.body);
  if (req.session.user) {
    const user = req.session.user;
    user.loggedIn = true;
    res.send({ ...user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.use("/images", express.static(`../my-react/public`));
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/carts", cartRouter);
app.use("/api/discount", discountRoute);
app.use("/api/checkout", orderRouter);
app.use("/api/stripe", payementRouter);

app.use("/api/admin", adminRouter);

// errors handlers

// app.get('/', (req, res) => { res.send("API is running at port 5000") })

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Running listening to port ${PORT}...`));
