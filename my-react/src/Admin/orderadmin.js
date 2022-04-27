import React, { useEffect, useState } from "react";
import { getallOrdersadmin } from "./API/imageApi";
import { Link } from "react-router-dom";
import { AdminHeader } from "./adminHeader";
import { Loading } from "../loading";

export const Orders = () => {
  const [order, setorder] = useState({});
  const [loading, setloading] = useState(false);

  const orderees = async () => {
    setloading(true);
    const Products = await getallOrdersadmin();
    console.log(Products);
    setorder(Products);
    setloading(false);
  };

  useEffect(() => {
    orderees();
  }, []);

  return (
    <>
      {loading && <Loading />}

      <AdminHeader />
      {order && Object.keys(order).length !== 0 && (
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
                  <div className="products-list">
                    <div className="actions flex items-center">
                      <h3>Orders</h3>
                    </div>
                    <div className="added-products">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>S. No</th>
                            <th>Order No.</th>
                            <th>Date</th>
                            <th>Payment Status</th>
                            <th>Fulfillment Status</th>
                            <th>Items</th>
                            <th className="text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.map((e, i) => {
                            return (
                              <tr key={e.orderno}>
                                <td>{i + 1}</td>
                                <td>
                                  <Link to={`/orderdetails/${e.orderno}`}>
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
                                <td>{e.fullquantity} items</td>
                                <td className="text-right">
                                  {" "}
                                  ${e.totalamount}
                                </td>
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
          </section>
        </div>
      )}
    </>
  );
};
