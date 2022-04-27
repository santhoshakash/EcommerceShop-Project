import {
  ORDER_GETALL_SUCCESS,
  ORDER_GETALL_FAIL,
  ORDER_DETAIL_SUCCESS,
  ORDER_DETAIL_FAIL,
} from "../Constants/OrderConstant";

export const orderReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_GETALL_SUCCESS:
      console.log(action.payload);
      return { loading: false, orders: action.payload };
    case ORDER_GETALL_FAIL:
      return { loading: false, errors: action.payload };
    default:
      return state;
  }
};

export const orderdetailsReducer = (state = { orderDetail: {} }, action) => {
  switch (action.type) {
    case ORDER_DETAIL_SUCCESS:
      console.log(action.payload);
      return { loading: false, orderDetail: action.payload };
    case ORDER_DETAIL_FAIL:
      return { loading: false, errors: action.payload };
    default:
      return state;
  }
};
