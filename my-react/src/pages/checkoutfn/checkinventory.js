import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getorderdetail } from "../../userApi/api";
import { Loading } from "../loading";
import { status } from "../../userApi/api";
import { removeallcart } from "../../userApi/api";
import { increment } from "../../userApi/api";
import { Navigate } from "react-router";
import { Email } from "../email";
import ReactDOMServer from "react-dom/server";
import { compose } from "redux";
import axios from "axios";

export const Checkinventory = () => {
  const [loadings, setloadings] = useState(true);

  let orderid = useParams();
  console.log(orderid);
  let detailorder;
  const orderd = async () => {
    const detailorder = await getorderdetail(orderid.id);
    console.log(detailorder);
    const userid = detailorder.userId._id;
    const data = await removeallcart(userid);
    const updatestatus = await status(orderid);

    console.log(data);
    console.log(orderid);
    console.log(updatestatus);
    console.log(detailorder.discountCode);
    const couponcode = detailorder.discountCode;
    console.log(couponcode);
    if (couponcode !== "") {
      const increment1 = await increment(couponcode);
      console.log(increment1);
    }
    const messageHtml = ReactDOMServer.renderToString(
      <Email order={orderid.id}></Email>
    );

    setloadings(false);

    const sendemail = await axios.post("/api/checkout/email", {
      message: messageHtml,
    });
  };

  useEffect(() => {
    orderd();
  }, []);

  if (loadings) {
    return <Loading />;
  } else {
    console.log(orderid.id);
    return <Navigate to={`/success/${orderid.id}`} />;
  }
};
