import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { AdminHeader } from "./adminHeader.js";
import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import { getimages } from "./API/imageApi.js";
import { ToastContainer, toast } from "react-toastify";
import { editproduct } from "./API/imageApi.js";

import { getoneproduct } from "./API/imageApi.js";

import { Loading } from "../loading.js";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

export const Editproduct = () => {
  const navigate = useNavigate();
  const [image, setimage] = useState({});

  const [product, setproduct] = useState({});
  const [loading, setloading] = useState(false);
  const toastid = React.useRef(null);

  const Toastobjects = {
    pauseOnFocusLoss: false,
    position: toast.POSITION.TOP_CENTER,
    draggable: false,
    pauseOnHover: false,
    autoClose: 4000,
  };

  const { id } = useParams();
  console.log(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const editproducts = async () => {
    setloading(true);
    const products = await getoneproduct(id);
    setproduct(products);
    setimage(products.images);
    setloading(false);
  };

  useEffect(() => {
    editproducts();
  }, []);
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const img = await getimages(file);
    setimage(img.data);
  };
  const submithandle = async (data) => {
    if (Object.keys(image).length === 0) {
      if (!toast.isActive(toastid.current)) {
        toastid.current = toast.info("Please add a product image", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      return;
    }
    data.images = image;

    data.id = id;
    console.log(id);
    console.log(image);
    console.log(data);
    try {
      let uploaddata = await editproduct(data);
      console.log(uploaddata.status);
      if (uploaddata.status === "success") {
        if (!toast.isActive(toastid.current)) {
          toastid.current = toast.success("Product updated", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } else {
        if (!toast.isActive(toastid.current)) {
          toastid.current = toast.error("SKU exist already", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    } catch (error) {}
  };

  // console.log(image);

  return (
    <>
      {loading && <Loading />}
      <AdminHeader />
      <ToastContainer limit={1} position="top-center" autoClose={2000} />;
      <div className="main-content">
        {Object.keys(product).length !== 0 && (
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
                      <h3>{product.name}</h3>
                      <button
                        href="admin-collection.html"
                        form="updateform"
                        className="button button--hollow justify-end inline-block"
                      >
                        Update
                      </button>
                    </div>
                    <div className="edit-product">
                      <div className="flex">
                        <div className="product-lineitems form-section">
                          <form
                            id="updateform"
                            onSubmit={handleSubmit(submithandle)}
                          >
                            <div className="form-control">
                              <label htmlFor="product-name">Product Name</label>
                              <input
                                type="text"
                                defaultValue={product.name}
                                {...register("name", {
                                  required: true,
                                })}
                              />
                              {errors.name && (
                                <p className="error1">Please enter the name</p>
                              )}
                            </div>
                            <div className="form-control">
                              <label htmlFor="sku">SKU</label>
                              <input
                                type="text"
                                defaultValue={product.sku}
                                {...register("sku", {
                                  required: true,
                                })}
                              />
                              {errors.sku && (
                                <p className="error1">Please enter the sku</p>
                              )}
                            </div>
                            <div className="flex">
                              <div className="form-control pr-10">
                                <label htmlFor="price">Price ($)</label>
                                <input
                                  type="text"
                                  defaultValue={Number(product.price)}
                                  {...register("price", {
                                    required: true,
                                    pattern: {},
                                  })}
                                />
                                {errors.price && (
                                  <p className="error1">
                                    Please enter the price
                                  </p>
                                )}
                              </div>
                              <div className="form-control pl-10">
                                <label htmlFor="inventory">Inventory</label>
                                <input
                                  type="text"
                                  defaultValue={product.Stock}
                                  {...register("Stock", {
                                    required: true,
                                    pattern: {},
                                  })}
                                />
                                {errors.Stock && (
                                  <p className="error1">
                                    Please enter the inventory
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="form-control">
                              <label htmlFor="status">Product Status</label>
                              <div className="mt-10">
                                <span className="pr-20">
                                  <input
                                    type="radio"
                                    defaultChecked={
                                      product.status === "available"
                                        ? true
                                        : false
                                    }
                                    value="available"
                                    {...register("status")}
                                  />{" "}
                                  Active
                                </span>
                                <span>
                                  <input
                                    type="radio"
                                    defaultChecked={
                                      product.status === "available"
                                        ? false
                                        : true
                                    }
                                    value="unavailable"
                                    {...register("status")}
                                    //{...register("inactive")}
                                  />{" "}
                                  Inactive
                                </span>
                              </div>
                            </div>
                            <div className="form-control">
                              <label htmlFor="description">Description</label>
                              <textarea
                                cols="5"
                                rows="10"
                                defaultValue={product.description}
                                {...register("description", {
                                  required: true,
                                })}
                              />
                              {errors.description && (
                                <p className="error1">
                                  Please enter the description
                                </p>
                              )}
                            </div>
                            <button
                              form="updateform"
                              className="button button--hollow justify-end inline-block"
                              type="submit"
                            >
                              Update
                            </button>
                          </form>
                        </div>
                        <div className="product-imageitem">
                          <div id="wrapper">
                            <label htmlFor="description">Product Image</label>
                            <div className="mt-10">
                              <div className="tooltip">
                                <span className="tooltiptext">
                                  {Object.keys(image).length !== 0
                                    ? "Click image to remove"
                                    : ""}
                                </span>
                                {Object.keys(image).length === 0 ? (
                                  <label
                                    htmlFor="image-file"
                                    className="drop-zone"
                                  >
                                    <input
                                      type="file"
                                      id="image-file"
                                      className="drop-zone__input"
                                      onChange={uploadFileHandler}
                                      required
                                    />
                                    Drop file here or click to upload
                                  </label>
                                ) : (
                                  <img
                                    src={image}
                                    alt="images"
                                    onClick={() => setimage({})}
                                    className="drop-zone"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};
