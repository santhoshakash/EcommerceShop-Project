import { ToastContainer, toast } from "react-toastify";

import { useContext, useEffect, useRef, useState } from "react";

import { Footer } from "./Footer";
import { HandleAddCoupon } from "../utils/discounts";
import { Header } from "./Header";
import { Link } from "react-router-dom";
import Loader from "react-js-loader";
import { Usercontext } from "../context/Authcontext";
import { updatecheckQuantity } from "../userApi/api";
import React from "react";
import { Loading } from "../loading";
import ReactLoading from "react-loading";
import Toast from "../components/LoadingError/Toast";
import axios from "axios";
import { useParams } from "react-router";
import { Noproduct } from "./noproduct";

export const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState();
  const [netTotal, setNetTotal] = useState(0);
  const [discount, setDiscount] = useState();
  const [error, seterror] = useState(false);
  const [datas, setdatas] = useState();
  const [quantity, setQuantity] = useState(false);

  const [discountState, setDiscountState] = useState(false);
  const [noproduct, setnoproduct] = useState(false);
  const [code, setCode] = useState("");
  const [cartData, setCartData] = useState([]);
  const [newQty, setNewQty] = useState();
  const [cartProducts, setCartProducts] = useState(() => cartData.products);
  const [discountedProducts, setDiscountedProducts] = useState();
  const couponRef = useRef();
  // for Toast
  const toastId = React.useRef(null);
  const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    position: toast.POSITION.TOP_CENTER,

    pauseOnHover: false,
    autoClose: 4000,
  };
  const { values } = useContext(Usercontext);
  const userId = values._id;

  const productVerification = async (userId, data, quantity) => {
    const canBuy =
      data.Stock >= quantity &&
      quantity > 0 &&
      data.status === "available" &&
      quantity % 1 === 0;
    if (canBuy) {
      data.error = false;
      return data;
    } else {
      data.error = true;
      return data;
    }
  };

  const discountisvalid = async (code) => {
    const { data } = await axios.post("/api/discount/discheck", { code: code });

    if (!data) {
      return true;
    }

    const expired =
      data.endDate >= new Date().toISOString() && data.status === "enable";

    const scheduled = data.startDate <= new Date().toISOString();

    if (expired && scheduled) {
      return false;
    } else {
      return true;
    }
  };

  const discountCheck = async (code) => {
    const { data } = await axios.post("/api/discount/discheck", { code: code });

    const expired =
      data.endDate >= new Date().toISOString() && data.status === "enable";

    if (!expired) {
      const response = await axios.delete(
        `/api/discount/removecoupon/${userId}`
      );
      getCartItems(userId);
    }
  };

  const getCartItems = async (id) => {
    setLoading(true);

    const { data } = await axios.get(`/api/carts/${id}`);

    if (data.length === 0) {
      setnoproduct(true);
      setLoading(false);
      return;
    }

    const checking = await check(data);

    if (data && data.couponCode) {
      const discountcheck = await discountCheck(data.couponCode);
      const finalData = await HandleAddCoupon(data);
      if (finalData) {
        setDiscountState(true);
        setCartData(finalData);
        setCode(finalData.couponCode);

        setCartProducts(data.products);
      }
    } else {
      setDiscountState(false);

      setCartData(data);

      setCartProducts(data.products);
    }
    setLoading(false);
  };

  const removeFromCartHandler = async (userId, _id) => {
    setLoading(true);
    const { data } = await axios.delete(`/api/carts/${userId}/${_id}`);

    if (data.products.length !== 0) {
      setLoading(false);
      setCartData(data);
    } else if (data.products.length === 0) {
      setnoproduct(true);
      setLoading(false);

      setCartData([]);

      setLoading(false);
    }
  };
  const updateCartHandler = async (userId, sku, qty, inventory) => {
    console.log(userId, sku, qty, inventory);
    if (qty * 1 === 0) {
      setQuantity(true);
      if (!toast.isActive(toastId.current))
        toastId.current = toast.error(`Invalid Quantity `, Toastobjects);
      return;
    }
    if (inventory < qty) {
      setQuantity(true);
      if (!toast.isActive(toastId.current))
        toastId.current = toast.error(
          `${inventory} products were left in inventory  `,
          Toastobjects
        );

      getCartItems(userId);
      setLoading(true);

      setLoading(false);
      return;
    }
    if (inventory >= qty && qty > 0 && qty % 1 === 0) {
      setLoading(true);

      const { data } = await axios.put(`/api/carts/${userId}`, { sku, qty });

      if (data) {
        setCartData(data);
        getCartItems(userId);
        setLoading(false);
      }
      setTotal(data.bill);

      if (!toast.isActive(toastId.current))
        toastId.current = toast.success("Quantity was  successfully updated");
    } else {
      setQuantity(true);

      if (!toast.isActive(toastId.current))
        toastId.current = toast.error(
          "Selected quantity is invalid",
          Toastobjects
        );
      setLoading(true);

      getCartItems(userId);

      setLoading(false);
      return;
    }
  };

  const handleQuantity = (i, value) => {
    let cartArr = [...cartProducts];

    cartArr[i].quantity = value;
  };

  const updateQuantity = async () => {
    const result = await Promise.all(
      cartProducts.map(async (e) => {
        const result1 = await updatecheckQuantity(
          userId,
          e.productId._id,
          e.quantity,
          e.productId.sku
        );

        if (result1) {
          toast.error(result1);
          getCartItems(userId);
        } else {
          getCartItems(userId);
        }
        return result1;
      })
    );
    if (result.map((i) => i === undefined)) {
      getCartItems(userId);

      toast.success("Qty Updated Successfully");
    }

    setTotal(cartData.bill);
  };

  const handleCoupon = async (e) => {
    const datas = await discountisvalid(couponRef.current.value);

    if (datas) {
      console.log("error");
      if (!toast.isActive(toastId.current))
        toastId.current = toast.error("Coupon does not exist", Toastobjects);
      return;
    }

    const couponCode = couponRef.current.value;

    if (couponCode) {
      let tempObj = { ...cartData };
      tempObj.couponCode = couponCode;
      const data = await HandleAddCoupon(tempObj);
      console.log(data);
      setLoading(true);
      if (data.error) {
        setDiscountState(false);
        setCode("");
        setLoading(false);
        // console.log(data.error, "--------------------");
        toast.error(data.error);
      } else {
        setCartData(data);
        setDiscountState(true);
        setCode(couponCode);
        setLoading(false);
        toast.success("Coupon successfully added");
      }
    } else {
      toast.error("code does not exist");
    }
  };

  const onRemoveCouponHandler = async () => {
    setLoading(true);
    const response = await axios.delete(`/api/discount/removecoupon/${userId}`);

    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.info(` ${response.data.message}`, Toastobjects);
    }

    setDiscountState(false);
    setCode("");
    getCartItems(userId);

    setLoading(false);
    return discountState, code;
  };

  useEffect(() => {
    getCartItems(userId);
  }, []);

  const check = async (data) => {
    let error = [];
    await Promise.all(
      data.products.map(async (e, index) => {
        const data = await productVerification(userId, e.productId, e.quantity);
        if (data.error) {
          await removeFromCartHandler(userId, data._id);
          error.push(data);
        }
      })
    );
    if (error.length !== 0) {
      getCartItems(userId);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <ToastContainer limit={1} position="top-center" autoClose={3000} />
      {!loading && !noproduct && cartData.length !== 0 && (
        <div className="main-content">
          <Header />
          <section>
            <div className="container">
              <div className="cart-template page-content">
                <h2 className="mb ">Cart</h2>
                {/* {loading && <Loading />} */}

                {!loading && (
                  <div>
                    <div className="cart-count-price">
                      <p className="no-margin">
                        <span className="cart-total-quantity">
                          Total Cart Products: {cartData.products.length}items
                        </span>
                        <strong className="cart-total-price">
                          (
                          <span>
                            <span id="revy-cart-subtotal-price">
                              ${cartData.bill}
                            </span>
                          </span>
                          )
                        </strong>
                      </p>
                    </div>
                    <div className="main-cart-wrapper">
                      <div className="cart__items cart__block">
                        <div className="line-items">
                          {cartData.products.map((item, index) => (
                            <div className="line-item" key={item.productId._id}>
                              <div className="line-item__left">
                                <Link
                                  to={`/products/${item.productId._id}`}
                                  className="line-item__image-wrapper"
                                >
                                  <img
                                    className="line-item__image"
                                    src={item.productId.images}
                                    alt={item.productId.name}
                                    style={{ width: "240px", height: "160px" }}
                                  />
                                </Link>
                              </div>
                              <div className="line-item__right">
                                <div className="line-item__details">
                                  <h2 className="line-item-title">
                                    <Link
                                      to={`/products/${item.productId._id}`}
                                      className="cart__product-title"
                                    >
                                      {item.productId.name}
                                    </Link>
                                  </h2>
                                  <div
                                    onClick={() =>
                                      removeFromCartHandler(
                                        userId,
                                        item.productId._id
                                      )
                                    }
                                  >
                                    <div
                                      title="Remove item"
                                      className="line-item__remove"
                                      to="#"
                                    >
                                      <svg
                                        aria-hidden="true"
                                        viewBox="0 0 448 512"
                                        className="svg-inline--fa fa-trash-alt fa-w-14 fa-3x"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
                                          className=""
                                        ></path>
                                      </svg>
                                    </div>
                                  </div>
                                </div>

                                <div className="line-item__price">
                                  <span>
                                    <strong>Price:</strong>
                                  </span>
                                  ${item.productId.price}
                                </div>
                                <div className="line-item__total-amount-price">
                                  <span>
                                    <strong>Total Price:</strong>
                                  </span>
                                  ${item.productId.price * item.quantity}
                                </div>
                                <div className="line-item__quantity">
                                  <span className="line-item__quantity-text">
                                    Quantity:
                                  </span>
                                  <input
                                    type="number"
                                    name="updates[]"
                                    size="4"
                                    min="1"
                                    step="1"
                                    onChange={(e) =>
                                      handleQuantity(index, e.target.value)
                                    }
                                    defaultValue={
                                      item.quantity ||
                                      cartProducts[index].quantity
                                    }
                                    key={
                                      quantity &&
                                      (item.quantity ||
                                        cartProducts[index].quantity)
                                    }
                                  />
                                  <button
                                    className="button update_btn"
                                    type="submit"
                                    onClick={() =>
                                      updateCartHandler(
                                        userId,
                                        item.productId.sku,
                                        cartProducts[index].quantity,
                                        item.productId.Stock
                                      )
                                    }
                                  >
                                    Update Quantity
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {cartData.bill > 0 && (
                        <div className="cart__details cart__block">
                          <div className="cart__details-wrap">
                            <h5>ORDER SUMMARY</h5>
                            <p className="no-margin evenly-align">
                              <span className="cart-total-quantity">
                                {cartData.length} items
                              </span>
                              <span className="cart-total-price">
                                <span>
                                  $
                                  {Math.round(
                                    cartData.products
                                      .map(
                                        (product) =>
                                          product.productId.price *
                                          product.quantity
                                      )
                                      .reduce(
                                        (sum, product) => sum + product,
                                        0
                                      )
                                  )}
                                </span>
                              </span>
                            </p>
                            {discountState && (
                              <div className="cart-subtotal evenly-align cart__total">
                                <span className="cart-subtotal__title">
                                  Discounted amount
                                </span>

                                <strong>
                                  <span className="cart-subtotal__price">
                                    {/* ${items.productId.NewPrice} */}$
                                    {Math.round(
                                      cartData.products
                                        .map(
                                          (product) =>
                                            product.productId.price *
                                            product.quantity
                                        )
                                        .reduce(
                                          (sum, product) => sum + product,
                                          0
                                        )
                                    ) -
                                      Math.round(
                                        cartData.products
                                          .map(
                                            (product) =>
                                              (product.productId.price -
                                                product.productId.NewPrice) *
                                              product.quantity
                                          )
                                          .reduce(
                                            (sum, product) => sum + product,
                                            0
                                          )
                                      )}
                                  </span>
                                </strong>
                              </div>
                            )}
                            <div className="cart-subtotal evenly-align cart__total">
                              <span className="cart-subtotal__title">
                                Subtotal
                              </span>
                              <strong>
                                <span className="cart-subtotal__price">
                                  {/* ${cartData.bill} */}$
                                  {Math.round(
                                    cartData.products
                                      .map(
                                        (product) =>
                                          product.productId.price *
                                          product.quantity
                                      )
                                      .reduce(
                                        (sum, product) => sum + product,
                                        0
                                      )
                                  )}
                                </span>
                              </strong>
                            </div>
                            <div className="cart__total evenly-align">
                              <span className="cart__total-text">Total:</span>
                              <strong className="cart__total-price">
                                <span>
                                  {" "}
                                  $
                                  {Math.round(
                                    cartData.products
                                      .map(
                                        (product) =>
                                          product.productId.price *
                                          product.quantity
                                      )
                                      .reduce(
                                        (sum, product) => sum + product,
                                        0
                                      )
                                  )}
                                </span>
                                <span>USD</span>
                              </strong>
                            </div>
                            <button
                              className="button update_btn"
                              type="submit"
                              onClick={updateQuantity}
                            >
                              Update Quantity
                            </button>

                            {cartData.bill > 0 && (
                              <Link
                                to="/checkout"
                                className="button checkout_btn button--hollow"
                              >
                                Checkout
                              </Link>
                            )}
                            {!discountState && (
                              <div className="cart-promo">
                                <h5>ENTER A PROMO CODE</h5>
                                <input
                                  type="text"
                                  id="devPromo"
                                  name="code"
                                  defaultValue={code || ""}
                                  placeholder="Enter your code"
                                  // onChange={
                                  //   ((e) => setCode(e.target.value))
                                  // }
                                  ref={couponRef}
                                />
                                <button className="abtn" onClick={handleCoupon}>
                                  Apply Coupon
                                </button>
                              </div>
                            )}
                            {discountState && (
                              <div className="cart-promo">
                                <h5>PROMO CODE APPLIED</h5>
                                <h5>{code}</h5>
                                <button
                                  className="rbtn"
                                  onClick={onRemoveCouponHandler}
                                >
                                  REMOVE COUPON CODE
                                </button>
                              </div>
                            )}
                            <div className="text-center mt-20">
                              <Link
                                className="link-text-line"
                                to="/"
                                title="Continue shopping"
                              >
                                Continue shopping
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
          <Footer />
        </div>
      )}
      {noproduct && <Noproduct />}
    </>
  );
};
