import {
  // DISCOUNT_ADD_ITEM,
  // DISCOUNT_VERIFY_ITEM,
  // DISCOUNT_GETALL_ITEM,
  DISCOUNT_LIST_SUCCESS,
  DISCOUNT_LIST_FAIL,
} from "../Constants/DiscountConstant";

// export const productListReducer = (state = { Discount: [] }, action) => {
//   switch (action.type) {
//     // case PRODUCT_LIST_REQUEST:
//     //   return { products: [] };
//     case DISCOUNT_ADD_SUCCESS:
//       return { Discounts: action.payload };
//     case DISCOUNT_ADD_FAIL:
//       return { errors: action.payload };
//     default:
//       return state;
//   }
// };

// export const productDetailsReducer = (state = { Discount: [] }, action) => {
//   switch (action.type) {
//     case DISCOUNT_VERIFY_SUCCESS:
//       return { loading: false, Discounts: action.payload };
//     case DISCOUNT_VERIFY_FAIL:
//       return { loading: false, errors: action.payload };
//     default:
//       return state;
//   }
// };

////admin

export const DiscountlistReducer = (state = { discount: [] }, action) => {
  switch (action.type) {
    // case PRODUCT_LIST_REQUEST:
    //   return { products: [] };
    case DISCOUNT_LIST_SUCCESS:
      return { discount: action.payload };
    case DISCOUNT_LIST_FAIL:
      return { errors: action.payload };
    default:
      return state;
  }
};
