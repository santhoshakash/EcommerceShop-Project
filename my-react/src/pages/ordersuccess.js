import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { Check } from "./checkoutfn/checkinventory";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Ordersuccess = () => {
  const [userId, setUserId] = useState();

  let orderno = useParams().orderno;

  const getOrderDetailsHandler = async (orderno) => {
    const { data } = await axios.post("/api/checkout/orderDetails", {
      orderno,
    });
    // Check(orderno);

    setUserId(data.detailorder.userId._id);
  };
  useEffect(() => {
    getOrderDetailsHandler(orderno);
  }, []);

  return (
    <>
      <Header />
      <div className="main-content">
        <section>
          <div className="container">
            <div className="checkout-template page-content">
              <h2>Thank you</h2>
              <div className="checkout-details row">
                <div className="checkout-wrap">
                  <div className="checkout-section">
                    <div className="contact-info">
                      <div className="fieldset">
                        <h3>Order Placed</h3>
                        <p className="mt-20">
                          Thank you for placing your order.
                        </p>
                        <p className="mt-20">
                          Your order no.:
                          <Link to={`/orderbill/${orderno}`}>
                            {" "}
                            <u>{orderno}</u>
                          </Link>
                          . You can check your order{" "}
                          <Link to={`/orderbill/${orderno}`}>
                            <u>details</u>
                          </Link>{" "}
                          here.
                        </p>
                      </div>

                      <div className="action-btn">
                        <Link
                          to={`/myorders/${userId}`}
                          className="button button--hollow"
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/collections"
                          className="button secondary-btn"
                        >
                          Continue Shopping
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
