import axios from "axios";
// import products from "../Data/Product";
import { useState } from "react";

export const HandleAddCoupon = async (cartData) => {
  const { data } = await axios.post("/api/discount/verify", {
    cartData,
  });

  if (data) {
    let CurrentCoupon = data.code;
    if (CurrentCoupon) {
      if (data.status !== "disable") {
        if (data.status === "enable") {
          data.startDate = Date.parse(data.startDate);
          data.endDate = Date.parse(data.endDate);

          if (
            new Date().getTime() > data.startDate &&
            new Date().getTime() < data.endDate
          ) {
            let discountValue = data.value / 100;

            if (data.products.length === 0) {
              // all products
              cartData.products.map(
                (p) =>
                  (p.productId.NewPrice = p.productId.price * discountValue)
              );
              cartData.products.map(
                (p) => (p.productId.discountValue = discountValue)
              );
              cartData.products.map(
                (p) => (p.productId.discountCode = CurrentCoupon)
              );
            } else {
              const cartProductId = cartData.products.map(
                (product) => product.productId._id
              );

              const discountProductId = data.products.map(
                (product) => product.productId._id
              );

              const comparison = (arr1, arr2) => {
                const finalArray = [];
                arr1.forEach((e1) =>
                  arr2.forEach((e2) => {
                    if (e1 === e2) {
                      finalArray.push(e1);
                    }
                  })
                );

                return finalArray;
              };
              const discountableProductIds = comparison(
                cartProductId,
                discountProductId
              );

              let nonDiscountableProductIds = cartProductId.filter(
                (el) => !discountableProductIds.includes(el)
              );
              if (discountableProductIds.length === 0) {
                cartData.error = `specific product for this coupon is not available for your cart`;
                cartData.couponCode = "";
                cartData.discount = [];
                return cartData;

                cartData.error = true;

                return cartData;
              } else {
                let discountableproductdetails = [];
                cartData.products.forEach((e1) => {
                  discountableProductIds.forEach((e2) => {
                    if (e1.productId._id === e2) {
                      discountableproductdetails.push(e1);
                      e1.productId.NewPrice =
                        e1.productId.price * discountValue;
                      e1.productId.discountCode = CurrentCoupon;
                      e1.productId.discountValue = discountValue;
                    }
                  });
                });
                let nonDiscountableproductdetails = [];
                cartData.products.forEach((e1) => {
                  nonDiscountableProductIds.forEach((e2) => {
                    if (e1.productId._id === e2) {
                      nonDiscountableproductdetails.push(e1);
                      e1.productId.NewPrice = 0;
                      e1.productId.discountCode = "";
                      e1.productId.discountValue = 0;
                    }
                  });
                });
              }
            }
            let totalAmount = Math.round(
              cartData.products
                .map(
                  (product) =>
                    (product.productId.price - product.productId.NewPrice) *
                    product.quantity
                )
                .reduce((sum, product) => {
                  return sum + product;
                })
            );

            cartData.bill = totalAmount;
            cartData.error = false;

            return cartData;
          } else {
            // coupon time is expired

            cartData.error = "Discount coupon were expired";
            cartData.couponCode = "";
            cartData.discount = [];

            return cartData;
          }
        } else {
          // status is disabled

          cartData.error = "status is disabled";
          cartData.couponCode = "";
          cartData.discount = [];
          cartData.error = false;
          return cartData;
        }
      }
    } else {
      // coupon does not exists

      cartData.couponCode = "";
      cartData.discount = [];
      cartData.error = "coupon does not exists";

      return cartData;
    }
  }
};
