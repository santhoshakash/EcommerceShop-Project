import { Link, UseHistory } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { productVerifycart } from "../context/apicall";
import { Header } from "./Header";
import Toast from "../components/LoadingError/Toast";
import axios from "axios";
import { Usercontext } from "../context/Authcontext";
import { productDetails } from "../context/apicall";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { Footer } from "./Footer";

// let history = useHistory()
export const ProductIndividual = () => {
  // const [quantity, setquantity] = useState(1);
  const { values } = useContext(Usercontext);
  const userId = values._id;

  let navigate = useNavigate();
  const [product, setProduct] = useState({});

  const [quantity, setquantity] = useState(1);

  const { productid } = useParams();

  let productId = productid;

  const toastId = React.useRef(null);

  const Toastobjects = {
    pauseOnFocusLoss: false,
    position: toast.POSITION.TOP_CENTER,
    draggable: false,
    pauseOnHover: false,
    autoClose: 4000,
  };

  const productdetail = async (id) => {
    const data = await productDetails(id);

    setProduct(data);
  };

  const addtoCartHandler = async (e) => {
    e.preventDefault();
    const error = await productVerifycart(userId, productId, quantity);
    if (error) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error(error, Toastobjects);
      }
    } else {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success(
          "Product successfully added",
          Toastobjects
        );
      }
    }
  };

  useEffect(() => {
    productdetail(productId);
  }, []);

  return (
    <>
      <Header />
      <ToastContainer />
      {Object.keys(product).length !== 0 && (
        <div class="container">
          <div class="product-template page-content">
            <h2>Product Details</h2>
            <div class="product-details row">
              <div class="product-wrap">
                <div class="product-single">
                  <div class="product-media">
                    <a href="#">
                      <img
                        class="pic"
                        src={product.images}
                        alt={product.name}
                        style={{ width: "670px", height: "446px" }}
                      />
                    </a>
                  </div>
                  <div class="product-info">
                    <div class="right-side">
                      <span class="product-sku">SKU:{product.sku}</span>
                      <h3 class="product-title main-title">{product.name}</h3>
                      <div class="price">
                        <div class="regular-price">
                          <span>
                            <span class="money" data-currency-usd="$200.00">
                              ${product.price}.00
                            </span>
                          </span>
                        </div>
                      </div>
                      {product.Stock > 0 ? (
                        <div class="line-item-quantity">
                          <span class="line-item__quantity-text">
                            Quantity :{" "}
                          </span>

                          <input
                            type="number"
                            name=""
                            size="3"
                            id=""
                            value={quantity}
                            onChange={(e) => setquantity(e.target.value)}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      {product.Stock > 0 ? (
                        <div className="product-add">
                          <button
                            onClick={addtoCartHandler}
                            className="button button--alt"
                            name="add"
                            id="add"
                            type="submit"
                          >
                            Add to Bag
                          </button>
                        </div>
                      ) : (
                        <div className="stock">Out of Stock</div>
                      )}
                    </div>
                  </div>
                </div>
                <div class="desc-wrap">
                  <h4>Description</h4>
                  <div class="detail-desc">
                    <p>{product.description}</p>
                    {/* <p>
                      <strong>Composition & Washing</strong>
                    </p>
                    <p>
                      Jersey fabric: 100% cotton; woven fabric: 100% polyester,
                      exclusive of embroideries. Wash by hand in water. Do not
                      bleach. Iron at max. 110 °C using a damp cloth between the
                      iron and the fabric. Do not dry clean. Do not tumble dry.
                      Flat drying in the shade.
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};
