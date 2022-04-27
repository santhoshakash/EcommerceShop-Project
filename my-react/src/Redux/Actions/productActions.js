import {
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  // PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAIL,
} from "../Constants/ProductConstants";
// import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";

export const ProductDetails = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const Productslist = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/products");
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//admin

// export const addproduct = (products) => async (dispatch) => {
//   console.log(products);
//   // // formData.append("File", file);
//   // const {result} = await axios.post(`/api/admin/addproduct`),
//   try {
//     const { result } = await axios.post(`/api/admin/addproduct`, { products });
//     console.log("jhkh");
//     dispatch({ type: ADD_PRODUCT_SUCCESS, payload: result });
//   } catch (error) {
//     dispatch({
//       type: ADD_PRODUCT_FAIL,
//       payload:
//         error.response && error.response.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

// export const editproduct = (products1, id) => async (dispatch) => {
//   console.log(products1);
//   // console.log(products1);

//   // // formData.append("File", file);
//   // const {result} = await axios.post(`/api/admin/addproduct`),
//   try {
//     const { result } = await axios.post(`/api/admin/updateproduct`, {
//       products1,
//       id,
//     });
//     console.log("edit kula");
//     dispatch({ type: EDIT_PRODUCT_SUCCESS, payload: result });
//   } catch (error) {
//     dispatch({
//       type: EDIT_PRODUCT_FAIL,
//       payload:
//         error.response && error.response.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

// export const getoneproduct = (id) => async (dispatch) => {
//   try {
//     const { data } = await axios.get(`/api/admin/${id}`);
//     console.log(data);
//     dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({
//       type: PRODUCT_DETAILS_FAIL,
//       payload:
//         error.response && error.response.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

///////////////////////////////////////////////////////////////
// const cartSlice = createSlice({
//   name: "cart",
//   // initialState: {
//   //   userId: "",
//   //   products: [],
//   //   quantity: 0,
//   //   total: 0,
//   // },
//   reducers: {
//     addToCart: (state, action) => {
//       state.quantity += 1;
//       state.products.push(action.payload);
//       state.total += action.payload.price * action.payload.quantity;
//     },
//   },
// });
// export const { addProduct } = cartSlice.actions;
// export default cartSlice.reducer;
