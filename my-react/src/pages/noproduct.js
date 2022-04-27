import { Link } from "react-router-dom";
import { Header } from "./Header";
export const Noproduct = () => {
  return (
    <>
      <Header />
      <div className="cart-template page-content noproduct">
        <h1>NO PRODUCT AVAILABLE</h1>
        <Link to="/collections">
          <button className="button button--alt collect">
            Go to collection
          </button>
        </Link>
        <div className="top"></div>
      </div>
    </>
  );
};
