import {
  CART_ADD_ITEM,
  CART_GETALL_ITEM,
  CART_LIST_FAIL,
  CART_REMOVE_ITEM,
} from "../Constants/CartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_GETALL_ITEM:
      return {
        ...state,
        cartItems: action.payload,
      };
    case CART_ADD_ITEM:
      return {
        ...state,
        cartItems: action.payload,
      };
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: action.payload,
      };
    // case CART_LOADING:
    //   return {
    //     ...state,
    //   };
    case CART_LIST_FAIL:
      return { errors: action.payload };

    default:
      return state;
  }
};
