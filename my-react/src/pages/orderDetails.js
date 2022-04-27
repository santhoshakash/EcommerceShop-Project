import { useEffect, useState } from "react";
import { getorderdetail } from "../userApi/api";
import { useParams } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
export const Orderbill = () => {
  let { orderid } = useParams();

  const [datas, setdatas] = useState({});
  let dates;
  const order = async () => {
    const data = await getorderdetail(orderid);

    setdatas(data);
  };
  let total;
  useEffect(() => {
    order();
  }, []);
  return (
    <>
      <Header />
      <div className="main-content">
        <section>
          <div className="container">
            {Object.keys(datas).length !== 0 && (
              <div className="checkout-template page-content">
                <h2>Order #{orderid}</h2>
                <p>
                  Placed on{" "}
                  {new Date(datas.createdate)
                    .toString()
                    .split(" ")
                    .splice(1, 3)
                    .join(" ")}
                </p>
                <div className="mt-20">
                  <div className="flex">
                    <div className="address">
                      <h3>Billing Address</h3>
                      <p>{datas.data.contactName}</p>
                      <p>{datas.data.contactaddress}</p>
                      <p>Pincode: {datas.data.contactpostalcode}</p>
                      <p className="mt-20">
                        <strong>Payment Status: {datas.paymentstatus}</strong>
                      </p>
                    </div>
                    <div className="address">
                      <h3>Shipping Address</h3>
                      <p>{datas.data.shippingname}</p>
                      <p>{datas.data.shippingaddress}</p>
                      <p>Pincode: {datas.data.shippingpostalcode}</p>
                      <p className="mt-20">
                        <strong>
                          Fulfillment Status:{" "}
                          {datas.paymentstatus === "pending"
                            ? "NotFullfilled"
                            : "fullfilled"}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="my-orders row">
                  <div className="orders-wrap">
                    <div className="orders-list">
                      <table>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th className="text-right">Price</th>
                            <th>Quantity</th>
                            <th className="text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {datas.info.map((e) => {
                            return (
                              <tr key={e.productId}>
                                <td>{e.name}</td>
                                <td>{e.productId}</td>
                                <td className="text-right">
                                  ${e.actualPrice}.00
                                </td>
                                <td>{e.quantity}</td>
                                <td className="text-right">
                                  {e.actualPrice * e.quantity}
                                </td>
                              </tr>
                            );
                          })}

                          <tr>
                            <td colSpan="4">Subtotal</td>
                            <td className="text-right">
                              $
                              {datas &&
                                datas.totalamount - datas.discountedamount}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="4">Shipping</td>
                            <td className="text-right">$0</td>
                          </tr>
                          <tr>
                            <td colSpan="4">Tax (GST)</td>
                            <td className="text-right">$0</td>
                          </tr>
                          <tr>
                            <td colSpan="4">
                              Discount{" "}
                              <span>
                                (<strong>{datas && datas.discountCode}</strong>)
                              </span>
                            </td>
                            <td className="text-right">
                              {datas.discountedamount
                                ? `$${datas.discountedamount}`
                                : "--"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="4">
                              <strong>Total</strong>
                            </td>
                            <td className="text-right">
                              <strong>
                                ${datas.totalamount}
                                <span>USD</span>
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
