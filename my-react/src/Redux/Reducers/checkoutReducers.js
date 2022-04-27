import {
  Checkout_ADD_ITEM,
  Checkout_GETALL_ITEM,
  Checkout_LIST_FAIL,
  // ORDER_GETALL_FAIL,
  // ORDER_GETALL_ITEM,
} from "../Constants/checkoutConstant";

export const checkoutReducer = (state = { Items: [] }, action) => {
  switch (action.type) {
    case Checkout_GETALL_ITEM:
      return {
        ...state,
        Items: action.payload,
      };
    case Checkout_ADD_ITEM:
      return {
        ...state,
        Items: action.payload,
      };

    case Checkout_LIST_FAIL:
      return { errors: action.payload };

    default:
      return state;
  }
};
//admin
// export const editproduct = (state = { orders: [] }, action) => {
//   switch (action.type) {
//     case ORDER_GETALL_ITEM:
//       return { loading: false, orders: action.payload };
//     case ORDER_GETALL_FAIL:
//       return { loading: false, errors: action.payload };
//     default:
//       return state;
//   }
// };
