import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getimages } from "./API/imageApi.js";
import { set, useForm } from "react-hook-form";
import { addproduct } from "./API/imageApi.js";
import { AdminHeader } from "./adminHeader.js";
import React from "react";
import { Loading } from "../loading.js";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";

export const Addproduct = () => {
  const navigate = useNavigate();
  const toastid = React.useRef(null);

  const [image, setimage] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const img = await getimages(file);
    console.log(img);
    console.log(img);
    setimage(img.data);
  };

  const submithandle = async (data) => {
    data.images = image;
    console.log(image);
    console.log(data);

    if (Object.keys(image).length === 0) {
      if (!toast.isActive(toastid.current)) {
        toastid.current = toast.info("Please add a product image", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } else {
      console.log(data);
      setLoading(true);
      const addpro = await addproduct(data);
      setLoading(false);
      console.log(addpro);
      if (addpro) {
        console.log("product added successfully");
        if (!toast.isActive(toastid.current)) {
          toastid.current = toast.success("Product Added", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
        navigate("/admindashboard");
      } else {
        console.log("product not  added successfully");
        if (!toast.isActive(toastid.current)) {
          toastid.current = toast.success("Product not Added", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    }
  };

  return (
    <>
      {loading && <Loading />}
      <AdminHeader />
      <ToastContainer />
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
                    <h3>Add Product</h3>
                    <button
                      type="submit"
                      form="form"
                      className="button button--hollow justify-end inline-block"
                    >
                      Save
                    </button>
                  </div>
                  <div className="edit-product">
                    <div className="flex">
                      <div className="product-lineitems form-section">
                        <form id="form" onSubmit={handleSubmit(submithandle)}>
                          <div className="form-control">
                            <label htmlFor="product-name">Product Name</label>
                            <input
                              type="text"
                              placeholder=""
                              {...register("name", {
                                required: true,
                              })}
                            />{" "}
                            {errors.name && (
                              <p class="error1">Please Fill the details</p>
                            )}
                          </div>
                          <div className="form-control">
                            <label htmlFor="sku">SKU</label>
                            <input
                              type="text"
                              placeholder=""
                              {...register("sku", {
                                required: true,
                              })}
                            />{" "}
                            {errors.sku && (
                              <p class="error1">Please Fill the details</p>
                            )}
                          </div>
                          <div className="flex">
                            <div className="form-control pr-10">
                              <label htmlFor="price">Price ($)</label>
                              <input
                                type="text"
                                placeholder=""
                                {...register("price", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.price && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </div>
                            <div className="form-control pl-10">
                              <label htmlFor="inventory">Inventory</label>
                              <input
                                type="text"
                                placeholder=""
                                {...register("Stock", {
                                  required: true,
                                })}
                              />{" "}
                              {errors.Stock && (
                                <p class="error1">Please Fill the details</p>
                              )}
                            </div>
                          </div>
                          <div className="form-control">
                            <label htmlFor="status">Product Status</label>
                            <div className="mt-10">
                              <span className="pr-20">
                                <input
                                  type="radio"
                                  value="available"
                                  {...register("status")}
                                />{" "}
                                Active
                              </span>
                              <span>
                                <input
                                  type="radio"
                                  value="unavailable"
                                  {...register("status")}
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
                              {...register("description", {
                                required: true,
                              })}
                            ></textarea>{" "}
                            {errors.description && (
                              <p class="error1">Please Fill the details</p>
                            )}
                          </div>
                          <button
                            form="form"
                            type="submit"
                            className="button button--hollow justify-end inline-block"
                          >
                            Save
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
                                  src={`/images/${image}`}
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
      </div>
    </>
  );
};
