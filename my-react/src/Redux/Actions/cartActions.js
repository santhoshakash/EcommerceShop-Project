import {
  CART_ADD_ITEM,
  CART_GETALL_ITEM,
  CART_LIST_FAIL,
  CART_LOADING,
  CART_REMOVE_ITEM,
} from "../Constants/CartConstants";

import axios from "axios";

// dispatch({ type: CART_LOADING })
export const getCartItems = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/carts/${id}`);
    dispatch({ type: CART_GETALL_ITEM, payload: data });
  } catch (error) {
    dispatch({
      type: CART_LIST_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addToCart = (userId, productId, quantity) => async (dispatch) => {
  console.log(userId, productId, quantity);
  try {
    const { data } = await axios.post(`/api/carts/${userId}`, {
      productId,
      quantity,
    });
    dispatch({ type: CART_ADD_ITEM, payload: data });
    console.log(data);
    // console.log(payload);
  } catch (error) {
    dispatch({
      type: CART_LIST_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateCart = (userId, sku, qty) => async (dispatch) => {
  try {
    console.log(userId, sku, qty);
    const { data } = await axios.put(`/api/carts/${userId}`, { sku, qty });
    console.log(data);
    dispatch({
      type: CART_GETALL_ITEM,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CART_LIST_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const removeFromCart = (userId, _id) => async (dispatch) => {
  try {
    console.log(userId, _id);
    const { data } = await axios.delete(`/api/carts/${userId}/${_id}`);
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CART_LIST_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.data.message
          : error.message,
    });
  }
};
//////////
// export const addToCartdata = (data, userId, cart) => async (dispatch) => {
//   console.log(data, userId, cart);
//   try {
//     const { data } = await axios.post(`/api/checkout/${userId}`, {
//       data,
//       userId,
//       cart,
//     });
//     dispatch({ type: CART_ADD_ITEM, payload: data });
//     console.log(data);
//     // console.log(payload);
//   } catch (error) {
//     dispatch({
//       type: CART_LIST_FAIL,
//       payload:
//         error.response && error.response.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };
