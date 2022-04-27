import { useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminHeader } from "./adminHeader";

import { getorderdetail } from "./API/imageApi";
import { numberoforders } from "./API/imageApi";
import { Link } from "react-router-dom";
import { set } from "react-hook-form";
import { Loading } from "../loading";

export const Orderdetail = () => {
  let { orderid } = useParams();
  console.log(orderid);
  //   const dispatch = useDispatch();
  const [orders, setorders] = useState();
  const [numbers, setnumbers] = useState();
  const [loading, setloading] = useState(false);

  const orderdetail = async () => {
    setloading(true);
    const detailorder = await getorderdetail(orderid);
    console.log(detailorder);
    console.log(detailorder.orders.userId._id);
    setloading(false);
    const number = await numberoforders(detailorder.orders.userId._id);
    console.log(number);
    setnumbers(number.numoforders);
    setorders(detailorder);
  };
  console.log(numbers);

  useEffect(() => {
    orderdetail(orderid);
  }, []);

  return (
    <>
      {loading && <Loading />}
      <AdminHeader />

      {orders && Object.keys(orders).length !== 0 && (
        <div className="main-content">
          <section className="flex">
            <div className="container-fluid">
              <div className="admin-content">
                <div className="admin-left-nav mt-20">
                  <ul>
                    <li>
                      <Link to="/admindashboard">Products</Link>
                    </li>
                    <li>
                      <Link className="active" to="/orders">
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/discounts">Discount</Link>
                    </li>
                  </ul>
                </div>
                <div className="admin-right page-content">
                  {Object.keys(orders).length !== 0 && (
                    <div className="products-list">
                      <div className="actions flex items-center">
                        <h3>#{orders.orders.orderno}</h3>
                      </div>
                      <div className="actions flex items-center flex-start">
                        <span>
                          {new Date(orders.orders.createdate)
                            .toString()
                            .split(" ")
                            .splice(1, 3)
                            .join(" ")}{" "}
                        </span>
                      </div>
                      <div className="view-orders">
                        <div className="main-cart-wrapper">
                          <div className="cart__items cart__block">
                            <div className="line-items">
                              <table className="table">
                                {Object.keys(orders).length !== 0 &&
                                  orders.orders.info.map((e, i) => {
                                    return (
                                      <tr key={orders.orders.orderno}>
                                        <td>
                                          <div className="image-wrapper">
                                            <img
                                              className="line-item__image"
                                              src={`/images/${e.images}`}
                                              alt=""
                                              style={{
                                                width: "60px",
                                                height: "40px",
                                              }}
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          <h2 className="line-item-title">
                                            <a
                                              href="product.html"
                                              className="cart__product-title"
                                            >
                                              {e.name}
                                            </a>
                                          </h2>
                                          <label htmlFor="">
                                            SKU: <span>{e.productId}</span>
                                          </label>
                                        </td>
                                        <td>
                                          {e.actualPrice} ×{" "}
                                          <span>{e.quantity}</span>
                                        </td>
                                        <td>
                                          $ {Number(e.actualPrice * e.quantity)}
                                          .00
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </table>
                            </div>
                            <div className="order__details-wrap mt-10">
                              <div className="flex">
                                <h4>{orders.orders.paymentstatus}</h4>
                              </div>
                              <div className="flex border-t">
                                <span>Subtotal</span>
                                <span>{orders.orders.fullquantity} item</span>
                                <span>${orders.orders.totalamount}</span>
                              </div>
                              <div className="flex">
                                <span>Shipping</span>
                                <span>Standard (3.0 kg)</span>
                                <span>$0.00</span>
                              </div>
                              <div className="flex">
                                <span>Tax</span>
                                <span>GST 0%</span>
                                <span>$0.00</span>
                              </div>
                              <div className="flex">
                                <span>Discount</span>
                                <span>
                                  {orders.orders.discountCode
                                    ? orders.orders.discountCode
                                    : "NA"}
                                </span>
                                <span>
                                  {orders.orders.discountCode
                                    ? `${orders.orders.discountedamount}`
                                    : "NAi"}
                                  {/* //shipping time to be notted */}
                                </span>
                              </div>
                              <div className="flex">
                                <span>
                                  <strong>Total</strong>
                                </span>
                                <span>
                                  <strong>${orders.orders.totalamount}</strong>
                                </span>
                              </div>
                              <div className="flex border-t">
                                <span>Paid by customer</span>
                                <span>${orders.orders.totalamount}</span>
                              </div>
                              <div className="mt-20">
                                <button
                                  className="button update_btn"
                                  type="submit"
                                >
                                  Fulfill Item
                                </button>
                                <button
                                  href="#"
                                  className="button checkout_btn button--hollow"
                                >
                                  Create Shipping Label
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="cart__details cart__block add-margin">
                            <div className="order__details-wrap">
                              <h4>Customer</h4>
                              <p>
                                <a href="#">{orders.orders.data.contactName}</a>
                              </p>
                              <p>{numbers}orders</p>
                            </div>
                            <div className="order__details-wrap mt-10">
                              <div className="flex">
                                <h4>Contact Information</h4>
                                <a href="#">
                                  <u>Edit</u>
                                </a>
                              </div>
                              <p>
                                <a href="#">
                                  {orders.orders.data.contactemail}
                                </a>
                              </p>
                              <p>{orders.orders.data.contactnumber}</p>
                            </div>
                            <div className="order__details-wrap mt-10">
                              <div className="flex">
                                <h4>Shipping Address</h4>
                                <a href="#">
                                  <u>Edit</u>
                                </a>
                              </div>
                              <p>{orders.orders.data.shippingname}</p>
                              <p>{orders.orders.data.shippingaddress}</p>
                              <p> {orders.orders.data.shippingpostalcode}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
