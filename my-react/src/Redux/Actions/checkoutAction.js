import {
  Checkout_ADD_ITEM,
  Checkout_GETALL_ITEM,
  Checkout_LIST_FAIL,
  ORDER_GETALL_ITEM,
  ORDER_GETALL_FAIL,
} from "../Constants/checkoutConstant";
import axios from "axios";

// export const addcheckoutData = (data, userId, cart) => async (dispatch) => {
//   // console.log(data, userId, cart, "-------------------------");

//   try {
//     // const { data } = await axios.post(`/api/checkout/userId`, {
//     //   // productId,
//     //   data,
//     //   userId,
//     //   cart,
//     //   // quantity,
//     // });
//     console.log("--------------------------");
//     const data = await fetch(`http://localhost:5000/api/checkout/userId`, {
//       method: "POST",
//       body: JSON.stringify({
//         data,
//         userId,
//         cart,
//       }),
//     });
//     const final = await data.json();

//     dispatch({ type: Checkout_ADD_ITEM, payload: data });
//     // console.log(data);
//     // console.log(payload);
//   } catch (error) {
//     dispatch({
//       type: Checkout_LIST_FAIL,
//       payload:
//         error.response && error.response.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };
export const addcheckoutData = (data, userId, cart) => async (dispatch) => {
  console.log(data, userId, cart);
  try {
    const { data } = await axios.post(`/api/checkout/:${userId}`, {
      data,
      userId,
      cart,
    });
    dispatch({ type: Checkout_ADD_ITEM, payload: data });
    console.log(data);
    // console.log(payload);
  } catch (error) {
    dispatch({
      type: Checkout_LIST_FAIL,
      payload:
        error.response && error.response.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// export const getallOrdersadmin = () => async (dispatch) => {
//   console.log("ulla");
//   try {
//     const { data } = await axios.get(`api/admin/getallorders`);
//     dispatch({ type: ORDER_GETALL_ITEM, payload: data });
//     console.log(data, "varutha");
//   } catch (error) {
//     dispatch({
//       type: ORDER_GETALL_FAIL,
//       payload:
//         error.response && error.response.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };
