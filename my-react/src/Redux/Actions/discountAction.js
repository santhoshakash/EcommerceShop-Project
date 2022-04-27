// import {
//   DISCOUNT_LIST_SUCCESS,
//   DISCOUNT_LIST_FAIL,
// } from "../Constants/DiscountConstant";

// import axios from "axios";
// // export const getalldiscountadmin = async () => {
// //   const result = await fetch(`${url}/getalldiscount`, {
// //     method: "GET",
// //     credentials: "include",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   });
// //   const data = await result.json();
// //   return data.discounts;
// // };

// export const getalldiscount = () => async () => {
//   try {
//     const { data } = await axios.get("/getalldiscount");
//     dispatch({ type: DISCOUNT_LIST_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({
//       type: DISCOUNT_LIST_FAIL,
//       payload:
//         error.response && error.response.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };
