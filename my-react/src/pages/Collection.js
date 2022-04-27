import "../components/css/style.css";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Usercontext } from "../context/Authcontext";
import { allProducts } from "../context/apicall";
import { Loading } from "../loading";
import { Header } from "./Header";
import { Footer } from "./Footer";
export const Collection = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  const allProduct = async () => {
    setLoading(true);
    const data = await allProducts();

    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    allProduct();
  }, []);

  return (
    <>
      <Header />
      {loading && <Loading />}

      {Object.keys(products).length !== 0 && (
        <div class="main-content">
          <section>
            <div class="container">
              <div class="product-collection page-content">
                <h2 class="collec">Collections</h2>
                <div class="products-grid row">
                  {/* {loading && <Loading />} */}

                  {products &&
                    products.map((product) => (
                      <div className="grid-item" key={product._id}>
                        <div className="product-item">
                          <div className="product-image">
                            <Link to={`/products/${product._id}`}>
                              <div className="shopBack">
                                <img
                                  src={product.images}
                                  alt={product.name}
                                  style={{ width: "255px", height: "170px" }}
                                />
                              </div>
                            </Link>
                          </div>
                          <div className="product-content">
                            <p>
                              <Link to={`/products/${product._id}`}>
                                {product.name}
                              </Link>
                            </p>
                            <div className="price">
                              <div className="regular-price">
                                <span>
                                  <span className="money">
                                    ${product.price}.00
                                  </span>
                                </span>
                                {!product.Stock > 0 && (
                                  <p
                                    style={{
                                      paddingTop: "10px",
                                      color: "white",
                                      backgroundColor:
                                        "rgba(240, 11, 11, 0.699)",
                                    }}
                                  >
                                    Out Of Stock
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      <Footer />
    </>
  );
};
