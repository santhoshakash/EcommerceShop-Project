import { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { Footer } from "./Footer";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  CheckInventory,
  deccrementInventoryQuantity,
  incrementInventoryQuantity,
} from "../userApi/api";

import { Loading } from "../loading";
import { HandleAddCoupon } from "../utils/discounts";
import { Header } from "./Header";
import { Usercontext } from "../context/Authcontext";
import { Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useStripe } from "@stripe/react-stripe-js";
import { getorderdetail } from "../userApi/api";

export const Checkout = () => {
  const stripe = useStripe();
  const [discountState, setDiscountState] = useState(false);
  const [orderDetailsfromStripe, setOrderDetailsfromStripe] = useState();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  const { values } = useContext(Usercontext);

  let userId = values._id;
  const toastId = React.useRef(null);
  const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 4000,
  };

  const {
    register: register1,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { orderno } = useParams();
  if (orderno) {
  }

  const orderde = async (orderno) => {
    const data = await getorderdetail(orderno);

    setOrderDetailsfromStripe(data);
    data.info.map((p) => incrementInventoryQuantity(p._id, p.quantity));

    reset(data.data);
  };
  useEffect(() => {
    if (orderno) {
      orderde(orderno);
    }
  }, []);

  const getCartItems = async (id) => {
    const { data } = await axios.get(`/api/carts/${id}`);

    if (data && data.couponCode) {
      const finalData = await HandleAddCoupon(data);

      if (finalData) {
        setCartData(finalData);
        setCode(finalData.couponCode);

        setLoading(false);

        setTotalAmount(
          Math.round(
            data.products
              .map((product) => product.productId.price * product.quantity)
              .reduce((sum, product) => {
                return sum + product;
              })
          )
        );
      }
    } else {
      setCartData(data);
      setLoading(false);

      setTotalAmount(
        Math.round(
          data.products
            .map((product) => product.productId.price * product.quantity)
            .reduce((sum, product) => {
              return sum + product;
            })
        )
      );
    }
  };

  useEffect(() => {
    getCartItems(userId);
  }, []);

  let info = [];
  let stripe1 = [];

  let item = [];
  item.push(cartData);

  let qua = 0;
  if (Object.keys(cartData).length !== 0) {
    const cartDatas = item[0].products.forEach((e) => {
      const obj = {};
      const obj1 = {};
      obj.name = e.productId.name;
      obj.actualPrice = e.productId.price;
      obj.images = e.productId.images;
      obj.quantity = e.quantity;
      qua += e.quantity;
      obj._id = e.productId._id;

      obj.currency = "USD";
      obj.description = e.productId.description;
      obj.productId = e.productId.sku;

      obj1.name = e.productId.name;
      obj1.amount =
        (e.productId.NewPrice
          ? e.productId.price - e.productId.NewPrice
          : e.productId.price) * 100;
      obj1.quantity = e.quantity;
      obj1.currency = "USD";
      obj1.description = e.productId.description;
      stripe1.push(obj1);
      info.push(obj);
    });
  }
  let fullquantity = qua;

  let discountedamount = cartData.bill - totalAmount;

  let discountCode = cartData.couponCode;

  let totalamount = cartData.bill;

  const checkouthandler = async (data) => {
    let value;
    const result = await CheckInventory(info, userId);

    if (result) {
      const toastId = toast.error(
        "Some Products in your Checkout is OutOfStock"
      );
      setTimeout(() => {
        if (toast.isActive(toastId)) {
          toast.update(toastId, {
            render: "Some Products in your Checkout is OutOfStock",
            onClose: () => {},
          });
        } else {
          toast.isActive("Succesfull");
        }
      }, 5000);
    } else {
      try {
        info.map((product) =>
          deccrementInventoryQuantity(product._id, product.quantity)
        );

        if (orderno) {
          value = await axios.post("/api/checkout/updateorder", {
            orderno,
            userId,
            info,
            data,
            fullquantity,
            discountedamount,
            discountCode,
            totalamount,
          });
        } else {
          value = await axios.post("/api/checkout/addorder", {
            userId,
            info,
            data,
            fullquantity,
            discountedamount,
            discountCode,
            totalamount,
          });
        }

        const sessions = await axios.post("/api/stripe/payement", {
          lineitem: stripe1,
          ordernumber: value.data.productdetail.orderno,
        });

        const { error } = await stripe.redirectToCheckout({
          sessionId: sessions.data.session.id,
        });
      } catch (error) {}
    }
  };

  return (
    <>
      {loading && <Loading />}

      <div className="main-content">
        <ToastContainer />

        <Header />
        <section>
          <div className="container">
            <div className="checkout-template page-content">
              <h2>Checkout</h2>
              <div className="checkout-details row">
                <div className="checkout-wrap">
                  <div className="checkout-section">
                    <div className="contact-info">
                      <form id="form" onSubmit={handleSubmit(checkouthandler)}>
                        <div className="fieldset">
                          <h3>Contact information</h3>
                          <div className="field-input">
                            <label htmlFor="name">Name</label>
                            <span>
                              <input
                                type="text"
                                className="input-text"
                                placeholder="Enter your name"
                                {...register1("contactName", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.contactName && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </span>
                          </div>
                          <div className="field-input">
                            <label htmlFor="name">Email Id</label>
                            <span>
                              <input
                                type="email"
                                className="input-text"
                                placeholder="Enter your email id"
                                {...register1("contactemail", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.contactemail && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </span>
                          </div>
                          <div className="field-input">
                            <label htmlFor="name">Phone</label>
                            <span>
                              <input
                                type="text"
                                className="input-text"
                                placeholder="Enter your phone no."
                                {...register1("contactnumber", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.contactnumber && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </span>
                          </div>
                          <div className="field-input">
                            <label htmlFor="name">Address</label>
                            <span>
                              <input
                                type="text"
                                className="input-text"
                                placeholder="Enter your address"
                                {...register1("contactaddress", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.contactaddress && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </span>
                          </div>
                          <div className="field-input">
                            <label htmlFor="name">Postal Code</label>
                            <span>
                              <input
                                type="text"
                                className="input-text"
                                placeholder="Enter your postal code"
                                {...register1("contactpostalcode", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.contactpostalcode && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="fieldset">
                          <h3>Shipping Address</h3>
                          <div className="field-input">
                            <label htmlFor="name">Name</label>
                            <span>
                              <input
                                type="text"
                                className="input-text"
                                placeholder="Enter your name"
                                {...register1("shippingname", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.shippingname && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </span>
                          </div>
                          <div className="field-input">
                            <label htmlFor="name">Email Id</label>
                            <span>
                              <input
                                type="email"
                                className="input-text"
                                placeholder="Enter your email id"
                                {...register1("shippingemail", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.shippingemail && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </span>
                          </div>
                          <div className="field-input">
                            <label htmlFor="name">Phone</label>
                            <span>
                              <input
                                type="text"
                                className="input-text"
                                placeholder="Enter your phone no."
                                {...register1("shippingnumber", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.shippingnumber && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </span>
                          </div>
                          <div className="field-input">
                            <label htmlFor="name">Address</label>
                            <span>
                              <input
                                type="text"
                                className="input-text"
                                placeholder="Enter your address"
                                {...register1("shippingaddress", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.shippingaddress && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </span>
                          </div>
                          <div className="field-input">
                            <label htmlFor="name">Postal Code</label>
                            <span>
                              <input
                                type="text"
                                className="input-text"
                                placeholder="Enter your postal code"
                                {...register1("shippingpostalcode", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.shippingpostalcode && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="action-btn">
                          <button
                            type="submit"
                            className="button button--hollow"
                            form="form"
                            // onClick={CheckoutHandler}
                          >
                            Proceed to Payment
                          </button>

                          <Link to="/cart" className="button secondary-btn">
                            Return to Cart
                          </Link>
                        </div>
                      </form>
                    </div>
                    <div className="order-summary-right">
                      <div className="order-summary__sections">
                        <div className="">
                          <div className="order-summary__section__content">
                            <table className="product-table">
                              <thead className="product-table__header">
                                <tr>
                                  <th>
                                    <span className="visually-hidden">
                                      Image
                                    </span>
                                  </th>
                                  <th>
                                    <span className="visually-hidden">
                                      Description
                                    </span>
                                  </th>
                                  <th>
                                    <span className="visually-hidden">
                                      Quantity
                                    </span>
                                  </th>
                                  <th>
                                    <span className="visually-hidden">
                                      Price
                                    </span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {!loading &&
                                  cartData.products.map((item, index) => (
                                    <>
                                      <tr className="product" key={index}>
                                        <td className="product__image">
                                          <div className="product-thumbnail ">
                                            <div className="product-thumbnail__wrapper">
                                              <img
                                                alt={item.productId.name}
                                                className="product-thumbnail__image"
                                                src={item.productId.images}
                                              />
                                            </div>
                                            <span className="product-thumbnail__quantity">
                                              {item.quantity}
                                            </span>
                                          </div>
                                        </td>
                                        <td
                                          className="product__description"
                                          scope="row"
                                        >
                                          <span className="product__description__name">
                                            {item.productId.name}
                                          </span>
                                          <span className="product__description__variant"></span>
                                        </td>
                                        <td className="product__quantity">
                                          <span className="visually-hidden">
                                            {item.quantity}
                                          </span>
                                        </td>
                                        <td className="product__price">
                                          <span className="order-summary__emphasis">
                                            {item.productId.discountCode && (
                                              <div>
                                                <del>
                                                  $
                                                  {item.productId.price *
                                                    item.quantity}
                                                  .00
                                                </del>
                                              </div>
                                            )}
                                            {item.productId.discountCode && (
                                              <div>
                                                $
                                                {Math.round(
                                                  (item.productId.price -
                                                    item.productId.NewPrice) *
                                                    item.quantity
                                                )}
                                                .00
                                              </div>
                                            )}
                                            {!item.productId.discountCode && (
                                              <div>
                                                $
                                                {item.productId.price *
                                                  item.quantity}
                                                .00
                                              </div>
                                            )}
                                          </span>
                                        </td>
                                      </tr>
                                    </>
                                  ))}
                              </tbody>
                            </table>
                          </div>

                          {!loading && (
                            <>
                              <p className="no-margin evenly-align mt-20">
                                <span className="cart-total-quantity">
                                  {cartData.products.length} Items
                                </span>
                                <span className="cart-total-price">
                                  <span>${totalAmount}.00</span>
                                </span>
                              </p>
                              <div className="cart-subtotal evenly-align cart__total">
                                <span className="cart-subtotal__title">
                                  Discount
                                </span>
                                <strong>
                                  <span className="cart-subtotal__price">
                                    $
                                    {cartData.couponCode ? (
                                      <>{totalAmount - cartData.bill}</>
                                    ) : (
                                      0
                                    )}
                                    .00
                                  </span>
                                </strong>
                              </div>
                              <div className="cart-subtotal evenly-align cart__total">
                                <span className="cart-subtotal__title">
                                  Tax(GST-0%)
                                </span>
                                <strong>
                                  <span className="cart-subtotal__price">
                                    $0.00
                                  </span>
                                </strong>
                              </div>
                              <div className="cart-subtotal evenly-align cart__total">
                                <span className="cart-subtotal__title">
                                  Shipping
                                </span>
                                <strong>
                                  <span className="cart-subtotal__price">
                                    $0.00
                                  </span>
                                </strong>
                              </div>
                              <div className="cart-subtotal evenly-align cart__total">
                                <span className="cart-subtotal__title">
                                  Subtotal
                                </span>
                                <strong>
                                  <span className="cart-subtotal__price">
                                    ${totalAmount}.00
                                  </span>
                                </strong>
                              </div>
                              <div className="cart__total evenly-align separator">
                                <span className="cart__total-text">Total:</span>
                                <strong className="cart__total-price text-lg">
                                  <span>${totalAmount}</span>
                                  <span> USD</span>
                                </strong>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};
