import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AdminHeader } from "./adminHeader";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getproductslist } from "./API/imageApi";
import { Loading } from "../loading";

export const Admindashboard = () => {
  const toastid = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const [num, setnum] = useState(false);
  const [product, setproduct] = useState({});
  const [box, setbox] = useState();
  const [check, setcheck] = useState(false);
  const [sku, setsku] = useState();
  const navigate = useNavigate();

  const fullproducts = async () => {
    setLoading(true);

    const products = await getproductslist();
    setproduct(products);
    setLoading(false);
  };

  useEffect(() => {
    fullproducts();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <AdminHeader />
      <ToastContainer />

      {Object.keys(product).length !== 0 && (
        <div className="main-content">
          <section className="flex">
            <div className="container-fluid">
              <div className="admin-content">
                <div className="admin-left-nav mt-20">
                  <ul>
                    <li>
                      <Link to="/admindashboard" className="active">
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/orders">Orders</Link>
                    </li>
                    <li>
                      <Link to="/discounts">Discount</Link>
                    </li>
                  </ul>
                </div>
                <div className="admin-right page-content">
                  <div className="products-list">
                    <div className="actions flex items-center">
                      <h3>Products</h3>
                      <Link
                        to="/addproducts"
                        className="button button--hollow justify-end inline-block"
                      >
                        Add Product
                      </Link>
                    </div>
                    <div className="actions flex items-center flex-start"></div>
                    <div className="added-products">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Price</th>
                            <th>Inventory</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.map((item, i) => {
                            return (
                              <React.Fragment key={item.sku}>
                                <tr>
                                  <td>{i + 1}</td>

                                  <td>
                                    <span className="admin-list-img">
                                      <img
                                        src={`/images/${item.images}`}
                                        alt=""
                                        style={{
                                          width: "50px",
                                          height: "33px",
                                        }}
                                      />
                                    </span>
                                  </td>
                                  <td>
                                    <div className="">
                                      <Link to={`/editproducts/${item._id}`}>
                                        <u>{item.name}</u>
                                      </Link>
                                    </div>
                                  </td>
                                  <td>{item.sku}</td>
                                  <td>{item.price}</td>
                                  <td>{item.Stock}</td>
                                  {item.status === "available" && (
                                    <td className="color-green">Active</td>
                                  )}
                                  {item.status === "unavailable" && (
                                    <td className="color-red">Inactive</td>
                                  )}
                                </tr>
                              </React.Fragment>
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
