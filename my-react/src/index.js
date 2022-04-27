import "./index.css";

import App from "./App";
import { Provider } from "react-redux";
import { Authcontextprovider } from "./context/Authcontext";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { store } from "./Redux/store";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export const stripepromise = loadStripe(
  "pk_test_51KWzjvSDTwncXAc77NjDsDMzZ2sfwMTvsuXgnA4vDqZu0e3GYVGZ58KnCQ8KB89iwZsOW3cmwL8anjhh4qhjG0RP00qoCdoh1Z"
);

ReactDOM.render(
  <Provider store={store}>
    <Authcontextprovider>
      <Elements stripe={stripepromise}>
        <App />
      </Elements>
    </Authcontextprovider>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
