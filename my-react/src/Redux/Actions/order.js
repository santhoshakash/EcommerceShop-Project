// import axios from "axios";
// import {
//   ORDER_GETALL_SUCCESS,
//   ORDER_GETALL_FAIL,
//   ORDER_DETAIL_SUCCESS,
//   ORDER_DETAIL_FAIL,
// } from "../Constants/OrderConstant";

// export const getallOrdersadmin = () => async (dispatch) => {
//   console.log("ulla");
//   try {
//     const { data } = await axios.get(`api/admin/getallorders`);
//     console.log(data, "varutha");
//     // console.log(data.products);
//     dispatch({ type: ORDER_GETALL_SUCCESS, payload: data });
//     // console.log(data, "varutha");
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

// export const getorderdetail = (orderid) => async (dispatch) => {
//   console.log(orderid, "order vanta");
//   try {
//     console.log("hi1");

//     const { data } = await axios.post(`/api/admin/getorderdetails`, {
//       orderid,
//     });
//     console.log("hi2");
//     console.log(data, "res varutha");
//     dispatch({ type: ORDER_DETAIL_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({
//       type: ORDER_DETAIL_FAIL,
//       payload:
//         error.response && error.response.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

// export const numberoforders = async (userId) => {
//   console.log(userId);
//   try {
//     const result = await axios.post(`api/admin/numberoforders`, {
//       userid: userId,
//     });
//     console.log(result);
//   } catch (error) {
//     console.log("There is no ordered for this userId");
//   }
// };
