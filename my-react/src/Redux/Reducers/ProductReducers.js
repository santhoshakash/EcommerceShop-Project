import {
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAIL,
} from "../Constants/ProductConstants";

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    // case PRODUCT_LIST_REQUEST:
    //   return { products: [] };
    case PRODUCT_LIST_SUCCESS:
      return { products: action.payload };
    case PRODUCT_LIST_FAIL:
      return { errors: action.payload };
    default:
      return state;
  }
};

export const productDetailsReducer = (state = { product: [] }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, errors: action.payload };
    default:
      return state;
  }
};

//admin
export const addproduct = (state = { product: [] }, action) => {
  switch (action.type) {
    case ADD_PRODUCT_SUCCESS:
      console.log(action.payload);
      return { loading: false, product: action.payload };
    case ADD_PRODUCT_FAIL:
      return { loading: false, errors: action.payload };
    default:
      return state;
  }
};

export const editproduct = (state = { product: [] }, action) => {
  switch (action.type) {
    case EDIT_PRODUCT_SUCCESS:
      return { loading: false, product: action.payload };
    case EDIT_PRODUCT_FAIL:
      return { loading: false, errors: action.payload };
    default:
      return state;
  }
};
