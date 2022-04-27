import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";

import { AdminHeader } from "./adminHeader";
import { deletediscount } from "./API/imageApi";
import { Link } from "react-router-dom";
import axios from "axios";
// import { Productslist } from "../Redux/Actions/productActions";
import { allProducts } from "../context/apicall";
import { useForm } from "react-hook-form";

export const Editdiscount = () => {
  const navigate = useNavigate();
  const [specific, setSpecific] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [discountData, setDiscountData] = useState();
  const [selectedProduct, setSelectedProduct] = useState({});
  const [addedProduct, setAddedProduct] = useState({});
  const [couponId, setCouponId] = useState();
  const [products1, setProducts1] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 4000,
  };
  const toastId = React.useRef(null);
  // const productList = useSelector((state) => state.productList);
  // const { loading, error, products } = productList;
  // let listOfProduct = products;
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(Productslist());
  // }, [dispatch]);

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
    let tempObj = { ...selectedProduct };
    setAddedProduct(tempObj);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { code_string, value, start_date, end_date, status, products } =
      e.target.elements;
    const productID = Object.keys(addedProduct);
    if (specific && productID.length === 0) {
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
    toast.success("Discount was edited successfully");

    axios.post("/api/discount/updatediscounts", { object, couponId });
  };

  const addSelectedProduct = (e, product) => {
    let tempObj = { ...selectedProduct };
    console.log(tempObj, selectedProduct);
    if (e.target.checked) {
      tempObj[product._id] = product;
    } else {
      delete tempObj[product._id];
    }
    setSelectedProduct(tempObj);
  };

  const removeAddedProduct = (product) => {
    let selectedObj = { ...selectedProduct };
    let addedObj = { ...addedProduct };
    delete selectedObj[product];
    delete addedObj[product];
    setSelectedProduct(selectedObj);
    setAddedProduct(selectedObj);
  };

  const deletecoupon = async (id) => {
    console.log(id);
    const result = await deletediscount(id);
    console.log(result);
    if (result.deletedata.deletedCount) {
      toast.success("Deleted successfully");
      // navigate("/discounts");
    }
  };

  const fetchData = async (id) => {
    const { data } = await axios.post("/api/discount/onecoupondetails", {
      id: id,
    });
    setCouponId(data._id);
    setDiscountData(data);
    let addedProduct = {};
    data.products.map((value, index) => {
      addedProduct[value._id] = { ...data.products[index].productId };
    });

    if (Object.keys(addedProduct).length) {
      setAddedProduct(addedProduct);
      setSelectedProduct(addedProduct);
    }
  };

  useEffect(() => {
    fetchData(id);
  }, []);

  const getDates = (datess) => {
    let date = new Date(datess);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt;
  };

  return (
    <>
      <AdminHeader />
      <ToastContainer limit={1} position="top-center" autoClose={2000} />;
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
              {discountData && (
                <div className="products-list">
                  <div className="actions flex items-center">
                    <h3>{discountData.code}</h3>
                  </div>
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
                                  defaultValue={discountData.code}
                                  required
                                />
                              </div>
                              <div className="w-50 pl-10">
                                <h4>Discount Value (in %)</h4>
                                <input
                                  type="text"
                                  placeholder=""
                                  className=""
                                  defaultValue={discountData.value}
                                  required
                                  name="value"
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
                                    defaultChecked={
                                      discountData.status === "enable"
                                        ? true
                                        : false
                                    }
                                    id="enable"
                                    required
                                    name="status"
                                    value={"enable"}
                                  />
                                  Enable
                                </label>
                              </div>
                              <div className="mt-10">
                                <label htmlFor="disable">
                                  <input
                                    type="radio"
                                    required
                                    id="disable"
                                    className="input-text"
                                    defaultChecked={
                                      discountData.status === "disable"
                                        ? true
                                        : false
                                    }
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
                                    id="all"
                                    defaultChecked={
                                      discountData.products.length === 0
                                        ? true
                                        : false
                                    }
                                    value={"all"}
                                    required
                                    name="products"
                                    onChange={() => {
                                      setAddedProduct({});
                                      setSelectedProduct({});
                                      setSpecific(false);
                                    }}
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
                                    defaultChecked={
                                      discountData.products.length > 0
                                        ? true
                                        : false
                                    }
                                    required
                                    value={"specific"}
                                    onClick={() => {
                                      setShowModal(true);
                                      setSpecific(true);
                                    }}
                                    name="products"
                                  />
                                  Specific products
                                </label>
                              </div>
                            </div>

                            {Object.keys(addedProduct).length !== 0 &&
                              Object.keys(addedProduct).map((product) => (
                                <table className="table">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <span className="admin-list-img">
                                          <img
                                            style={{
                                              width: "50px",
                                              height: "33px",
                                            }}
                                            src={addedProduct[product]?.images}
                                            alt={addedProduct[product]?.name}
                                          />
                                        </span>
                                      </td>
                                      <td>
                                        <div className="">
                                          <Link to="edit-product.html">
                                            <u>{addedProduct[product]?.name}</u>
                                          </Link>
                                        </div>
                                      </td>
                                      <td
                                        className="text-right"
                                        onClick={() =>
                                          removeAddedProduct(product)
                                        }
                                      >
                                        <span>
                                          {" "}
                                          <u>Remove</u>
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              ))}
                            <div className="mt-20 discount-period">
                              <h4>Active Dates</h4>
                              <div className="flex">
                                <div className="w-50 pr-10">
                                  <label htmlFor="">Start Date</label>
                                  required
                                  <input
                                    type="date"
                                    placeholder=""
                                    className=""
                                    defaultValue={getDates(
                                      discountData.startDate
                                    )}
                                    required
                                    name="start_date"
                                  />
                                </div>
                                <div className="w-50 pl-10">
                                  <label htmlFor="">End Date</label>
                                  <input
                                    type="date"
                                    placeholder=""
                                    className=""
                                    defaultValue={getDates(
                                      discountData.endDate
                                    )}
                                    required
                                    name="end_date"
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
                          <button
                            className="button update_btn"
                            onClick={(e) => deletecoupon(id)}
                          >
                            Delete
                          </button>
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
              )}
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
                                <input
                                  type="checkbox"
                                  required
                                  id="select-all"
                                />
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
                                    required
                                    onChange={(e) =>
                                      addSelectedProduct(e, product)
                                    }
                                    checked={Object.keys(
                                      selectedProduct
                                    ).includes(product._id)}
                                    style={{ margin: "20px" }}
                                    type="checkbox"
                                    name="prod-item"
                                  />
                                </td>
                                <td>
                                  <span className="admin-list-img">
                                    <img
                                      style={{
                                        width: "50px",
                                        height: "33px",
                                      }}
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
    </>
  );
};
