import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { AdminHeader } from "./adminHeader";
import { Link } from "react-router-dom";
import { allProducts } from "../context/apicall";
import Toast from "../components/LoadingError/Toast";
import axios from "axios";
// import { Productslist } from "../Redux/Actions/productActions";
import { set } from "react-hook-form";

export const CreateDiscount = () => {
  const [showModal, setShowModal] = useState(false);
  const [products1, setProducts1] = useState({});
  const [loading, setLoading] = useState(true);
  const [specificProduct, setSpecificProduct] = useState({
    list: {},
    added: {},
  });
  const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 4000,
    position: toast.POSITION.TOP_CENTER,
  };
  const toastId = React.useRef(null);

  const allfetchProduct = async () => {
    setLoading(true);
    const data = await allProducts();

    setProducts1(data);
    setLoading(false);
  };

  useEffect(() => {
    allfetchProduct();
  }, []);

  let listOfProduct = products1;

  const addSpecificProduct = () => {
    let tempObj = { ...specificProduct };
    tempObj.added = tempObj.list;
    console.log(tempObj);
    setSpecificProduct(tempObj);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { code_string, value, start_date, end_date, status, products } =
      e.target.elements;
    const productID = Object.keys(specificProduct.added);
    if (productID.length === 0) {
      toast.error("Please add a product for Specific");

      return false;
    }
    let arr = [];
    productID.map((id) => {
      arr.push({ productId: id });
    });
    const object = {
      value: value.value,
      startDate: start_date.value,
      endDate: end_date.value,
      status: status.value,
      products: products.value === [] ? [] : arr,
      code: code_string.value,
    };
    console.log(object);
    try {
      axios.post("/api/discount/add", object);
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(
          "Discount was created Successfully",
          Toastobjects
        );
      }
    } catch (error) {
      toast.error("discount code must be unique");
    }
  };

  const selectedProduct = (e, product) => {
    let tempObj = { ...specificProduct };
    console.log(tempObj, specificProduct);
    if (e.target.checked) {
      tempObj.list[product._id] = product;
    } else {
      delete tempObj.list[product._id];
    }
    console.log(tempObj);
    setSpecificProduct(tempObj);
  };

  const removeAddedProduct = (product) => {
    let tempObj = { ...specificProduct };
    delete tempObj.added[product];
    delete tempObj.list[product];
    setSpecificProduct(tempObj);
  };

  return (
    <div className="main-content">
      <AdminHeader />
      <ToastContainer />

      <section className="flex">
        <div className="container-fluid">
          <div className="admin-content">
            <div className="admin-left-nav mt-20">
              <ul>
                <li>
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
            <form
              onSubmit={handleFormSubmit}
              className="admin-right page-content"
            >
              <div className="products-list">
                <div className="view-orders">
                  <div className="main-cart-wrapper">
                    <div className="cart__items cart__block">
                      <div className="form-inline">
                        <div className="order__details-wrap">
                          <div className="flex">
                            <div className="w-50 pr-10">
                              <h4>Discount code</h4>
                              <input
                                type="text"
                                placeholder=""
                                className=""
                                name="code_string"
                                required
                              />
                            </div>
                            <div className="w-50 pl-10">
                              <h4>Discount Value (in %)</h4>
                              <input
                                type="text"
                                placeholder=""
                                className=""
                                name="value"
                                required
                              />
                            </div>
                          </div>
                          <div className="mt-10">
                            <h4>Status</h4>
                            <div className="">
                              <label htmlFor="enable">
                                <input
                                  type="radio"
                                  className="input-text"
                                  defaultChecked
                                  id="enable"
                                  name="status"
                                  value={"enable"}
                                  required
                                  // onChange={onChange}
                                />
                                Enable
                              </label>
                            </div>
                            <div className="mt-10">
                              <label htmlFor="disable">
                                <input
                                  required
                                  type="radio"
                                  className="input-text"
                                  id="disable"
                                  value={"disable"}
                                  name="status"
                                />
                                Disable
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="order__details-wrap mt-20">
                          <div className="">
                            <h4>Applies to</h4>
                            <div className="">
                              <label htmlFor="all">
                                <input
                                  type="radio"
                                  className="input-text"
                                  name="products"
                                  defaultChecked
                                  onChange={() =>
                                    setSpecificProduct({ list: {}, added: {} })
                                  }
                                  required
                                />
                                All Products
                              </label>
                            </div>
                            <div className="mt-10">
                              <label htmlFor="specific">
                                <input
                                  type="radio"
                                  className="input-text"
                                  id="specific"
                                  value={"specific"}
                                  onClick={() => setShowModal(true)}
                                  name="products"
                                  required
                                />
                                Specific products
                              </label>
                            </div>
                          </div>

                          {Object.keys(specificProduct.added).length !== 0 &&
                            Object.keys(specificProduct.added).map(
                              (product) => (
                                <table className="table">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <span className="admin-list-img">
                                          <img
                                            src={
                                              specificProduct.added[product]
                                                ?.images
                                            }
                                            alt={
                                              specificProduct.added[product]
                                                ?.name
                                            }
                                          />
                                        </span>
                                      </td>
                                      <td>
                                        <div className="">
                                          <Link
                                            to={`/editproducts/${product._id}`}
                                          >
                                            <u>
                                              {
                                                specificProduct.added[product]
                                                  ?.name
                                              }
                                            </u>
                                          </Link>
                                        </div>
                                      </td>
                                      <td
                                        className="text-right"
                                        onClick={() =>
                                          removeAddedProduct(product)
                                        }
                                      >
                                        <u>Remove</u>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              )
                            )}
                          <div className="mt-20 discount-period">
                            <h4>Active Dates</h4>
                            <div className="flex">
                              <div className="w-50 pr-10">
                                <label htmlFor="">Start Date</label>
                                <input
                                  type="date"
                                  placeholder=""
                                  className=""
                                  name="start_date"
                                  required
                                />
                              </div>
                              <div className="w-50 pl-10">
                                <label htmlFor="">End Date</label>
                                <input
                                  type="date"
                                  placeholder=""
                                  className=""
                                  name="end_date"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-20">
                        <button
                          className="button checkout_btn button--hollow"
                          type="submit"
                        >
                          Save
                        </button>
                        <Link to="/discounts">
                          <button className="button update_btn">Discard</button>
                        </Link>
                      </div>
                    </div>
                    <div className="cart__details cart__block add-margin">
                      <div className="order__details-wrap">
                        <h3>Summary</h3>
                        <div className="border-t mt-10">
                          <div className="flex mt-20">
                            <p>No information entered yet.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {showModal && (
              <div id="show-modal">
                <div
                  className="overlay"
                  onClick={() => setShowModal(false)}
                ></div>
                <div className="admin-right page-content">
                  <div className="products-list">
                    <div className="actions flex items-center">
                      <h3>Add products</h3>
                    </div>
                    <div className="added-products border-t">
                      <div className="overflow-auto">
                        <table className="table mt-20">
                          <thead>
                            <tr>
                              <th>
                                <input type="checkbox" id="select-all" />
                              </th>
                              <th>Image</th>
                              <th>Product Name</th>
                              <th>Price</th>
                              <th>Inventory</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listOfProduct.map((product) => (
                              <tr>
                                <td>
                                  <input
                                    onChange={(e) =>
                                      selectedProduct(e, product)
                                    }
                                    checked={specificProduct?.list[product._id]} // <-- use checked prop, retrieve value by id
                                    style={{ margin: "20px" }}
                                    type="checkbox"
                                    name="prod-item"
                                  />
                                </td>
                                <td>
                                  <span className="admin-list-img">
                                    <img
                                      src={product.images}
                                      alt={product.images}
                                    />
                                  </span>
                                </td>
                                <td>
                                  <div className="">
                                    <Link to="">
                                      <u>{product.name}</u>
                                    </Link>
                                  </div>
                                  <span>
                                    SKU: <span>{product.sku}</span>
                                  </span>
                                </td>
                                <td>{product.price}</td>
                                <td>{product.Stock}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-20">
                      <button
                        className="button checkout_btn button--hollow"
                        onClick={() => addSpecificProduct()}
                      >
                        Add Products
                      </button>
                      <button
                        className="button update_btn"
                        id="close-modal"
                        type="submit"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="footer bg-white">
        <div className="container-fluid">This is footer section</div>
      </footer>
    </div>
  );
};
