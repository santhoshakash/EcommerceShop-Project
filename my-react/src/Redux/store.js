import { applyMiddleware, combineReducers, createStore } from "redux";
import {
  productDetailsReducer,
  productListReducer,
} from "./Reducers/ProductReducers";
import { userLoginReducer, userRegisterReducer } from "./Reducers/UserReducers";
import { checkoutReducer } from "./Reducers/checkoutReducers";
import { cartReducer } from "./Reducers/CartReducers";
import { orderdetailsReducer, orderReducer } from "./Reducers/OrderReducer";
import { DiscountlistReducer } from "./Reducers/DiscountReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  checkout: checkoutReducer,
  // order: orderReducer,
  // orderDetail: orderdetailsReducer,
  // discountlist: DiscountlistReducer,
});

// const cartItemsFromLocalStorage = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : []

const userInfoFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : [];

// login
// const userInfoFromLocalStorage = localStorage.getItem("userInfo")
//   ? JSON.parse(localStorage.getItem("userInfo"))
//   : null;

const intialState = {
  cart: {},
  userLogin: { userInfo: userInfoFromLocalStorage },
};

const middleware = [thunk];

export const store = createStore(
  reducer,
  intialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
