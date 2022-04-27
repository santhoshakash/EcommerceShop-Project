import { Link } from "react-router-dom";
import { getalldiscount } from "./API/imageApi";
import { useState, useEffect } from "react";
import { AdminHeader } from "./adminHeader";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import React from "react";
import { Loading } from "../loading";
import { set } from "react-hook-form";

export const DiscountList = () => {
  const toastid = React.useRef(null);
  const [discount, setdiscount] = useState({});
  const [loading, setloading] = useState(false);
  const [tick, setTick] = useState();
  const [code, setcode] = useState();
  const navigate = useNavigate();

  const listdiscount = async () => {
    setloading(true);
    const discounts = await getalldiscount();
    console.log(discounts);
    setdiscount(discounts);
    setloading(false);
  };

  const date1 = new Date().toISOString();
  console.log(date1);

  const expirycheck = (startDate, endDate) => {
    if (startDate > new Date().toISOString()) {
      return "Scheduled";
    } else if (endDate < new Date().toISOString()) {
      return "finished";
    } else {
      return "Active";
    }
  };

  console.log(discount);
  useEffect(() => {
    listdiscount();
  }, []);
  return (
    <>
      {loading && <Loading />}
      <AdminHeader />
      <ToastContainer />

      {Object.keys(discount).length !== 0 && (
        <div className="main-content">
          <section className="flex">
            <div className="container-fluid">
              <div className="admin-content">
                <div className="admin-left-nav mt-20">
                  <ul>
                    <li>
                      {" "}
                      <Link to="/admindashboard">Products</Link>
                    </li>
                    <li>
                      <Link to="/orders">Orders</Link>
                    </li>
                    <li>
                      <Link className="active" to="/discounts">
                        Discount
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="admin-right page-content">
                  <div className="products-list">
                    <div className="actions flex items-center">
                      <h3>Discounts</h3>
                      <Link
                        to="/creatediscount"
                        className="button button--hollow justify-end inline-block"
                      >
                        Create Discount
                      </Link>
                    </div>
                    <div className="actions flex items-center flex-start"></div>
                    <div className="added-products">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>S. No</th>
                            <th>Discount Code</th>
                            <th>Times Used</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discount.map((e, i) => {
                            return (
                              <tr key={e.discountcode}>
                                <td>{i + 1}</td>
                                <td>
                                  <Link to={`/editdiscounts/${e._id}`}>
                                    <u>{e.code}</u>
                                  </Link>
                                  <p>
                                    {e.value}% off one-time purchase products
                                  </p>
                                </td>
                                <td>
                                  <span>{e.timeused}</span> used
                                </td>
                                <td>
                                  {new Date(e.startDate)
                                    .toString()
                                    .split(" ")
                                    .splice(1, 3)
                                    .join(" ")}
                                </td>
                                <td>
                                  {new Date(e.endDate)
                                    .toString()
                                    .split(" ")
                                    .splice(1, 3)
                                    .join(" ")}
                                </td>
                                {expirycheck(e.startDate, e.endDate) ===
                                  "Active" && (
                                  <td className="color-green">Active</td>
                                )}
                                {expirycheck(e.startDate, e.endDate) ===
                                  "finished" && (
                                  <td className="color-red">Expired</td>
                                )}
                                {expirycheck(e.startDate, e.endDate) ===
                                  "Scheduled" && (
                                  <td className="color-blue">Scheduled</td>
                                )}
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
