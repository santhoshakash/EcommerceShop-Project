import Stripe from "stripe";
import express from "express";
const payementRouter = express.Router();

payementRouter.post("/payement", async (req, res, next) => {
  console.log("str");
  console.log(req.body.ordernumber);
  console.log(req.body.lineitem);
  const stripe = new Stripe(process.env.STRIPE_SECERET_KEY, {
    apiVersion: "2020-08-27",
  });
  let line_items = req.body.lineitem;
  // let order = req.body.order;
  console.log(line_items);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    success_url: `http://localhost:3000/checkinventory/${req.body.ordernumber}`,
    cancel_url: `http://localhost:3000/checkout/${req.body.ordernumber}`,
  });

  console.log(session);

  return res.status(200).json({
    status: "success",
    session,
  });
});
export default payementRouter;
