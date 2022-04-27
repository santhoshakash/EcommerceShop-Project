import { useState, useEffect, useContext } from "react";
import { orderslist } from "../userApi/api";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Usercontext } from "../context/Authcontext";

export const Myorders = () => {
  const [order, setorder] = useState({});

  const { values } = useContext(Usercontext);

  const userId = values._id;

  const allorder = async () => {
    const orders = await orderslist(userId);

    setorder(orders);
  };

  useEffect(() => {
    allorder();
  }, []);

  return (
    <>
      <Header />
      <div className="main-content">
        <section>
          {/* {Object.keys(order).length !== 0 && ( */}
          <div className="container">
            <div className="checkout-template page-content">
              <h2>My Orders</h2>
              <div className="my-orders row">
                <div className="orders-wrap">
                  <div className="orders-list">
                    <table>
                      <thead>
                        <tr>
                          <th>S. No</th>
                          <th>Order No.</th>
                          <th>Date</th>
                          <th>Payment Status</th>
                          <th>Fulfillment Status</th>
                          <th className="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(order).length !== 0 &&
                          order.map((e, i) => {
                            return (
                              <tr key={e.orderno}>
                                <td>{i + 1}</td>
                                <td>
                                  <Link to={`/orderbill/${e.orderno}`}>
                                    <u>#{e.orderno}</u>
                                  </Link>
                                </td>
                                <td>
                                  {new Date(e.createdate)
                                    .toString()
                                    .split(" ")
                                    .splice(1, 3)
                                    .join(" ")}
                                </td>
                                <td>{e.paymentstatus}</td>
                                <td>{e.fulfilmentstatus}</td>
                                <td className="text-right">${e.totalamount}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* )} */}
        </section>
      </div>
      <Footer />
    </>
  );
};
