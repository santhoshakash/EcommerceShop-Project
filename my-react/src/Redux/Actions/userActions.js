// import {
//   USER_LOGIN_FAIL,
//   USER_LOGIN_REQUEST,
//   USER_LOGIN_SUCCESS,
//   USER_LOGOUT,
//   USER_REGISTER_FAIL,
//   USER_REGISTER_REQUEST,
//   USER_REGISTER_SUCCESS,
// } from "../Constants/UserConstants";

// import axios from "axios";
// import { useNavigate } from "react-router";

// // import { PRODUCT_DETAILS_SUCCESS } from "../Constants/ProductConstants"

// export const login = (email, password) => async (dispatch) => {
//   console.log(email, password);

//   axios.defaults.withCredentials = true;
//   try {
//     dispatch({ type: USER_LOGIN_REQUEST });

//     const config = {
//       // credentials: "include",

//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     const { data } = await axios.post(
//       `/api/users/login`,
//       { email, password },
//       config
//     );
//     console.log(data);
//     dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

//     localStorage.setItem("userInfo", JSON.stringify(data));
//   } catch (error) {
//     dispatch({
//       type: USER_LOGIN_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };
// // logout
// export const logout = () => (dispatch) => {
//   localStorage.removeItem("userInfo");
//   dispatch({ type: USER_LOGOUT });
// };

// export const registers = (email, password) => async (dispatch) => {
//   console.log(email, password);
//   try {
//     dispatch({ type: USER_REGISTER_REQUEST });

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     const { data } = await axios.post(
//       `/api/users`,
//       { email, password },
//       config
//     );
//     dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
//     dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

//     localStorage.setItem("userInfo", JSON.stringify(data));
//   } catch (error) {
//     dispatch({
//       type: USER_REGISTER_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };
