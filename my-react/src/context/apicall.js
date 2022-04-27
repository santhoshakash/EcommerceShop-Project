import axios from "axios";

//get all products
export const allProducts = async () => {
  const { data } = await axios.get("/api/products");
  console.log(data);
  return data;
};

//product details

export const productDetails = async (id) => {
  console.log(id, "...////");
  const { data } = await axios.get(`/api/products/${id}`);
  console.log(data);
  return data;
};

//productverfifcarion and add to cart

export const productVerifycart = async (userId, productId, quantity) => {
  const { data } = await axios.get(`/api/products/${productId}`);
  const addedpro =
    data.Stock > quantity &&
    quantity > 0 &&
    data.status === "available" &&
    quantity % 1 === 0;
  if (addedpro) {
    const { data } = await axios.post(`/api/carts/${userId}`, {
      productId,
      quantity,
    });
  } else {
    return (data.error = "Product was not added by this quantity");
  }
};
