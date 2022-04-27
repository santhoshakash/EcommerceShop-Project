import axios from "axios";

export const getorderdetail = async (orderid) => {
  try {
    const data = await axios.post(`/api/checkout/getorderdetails`, {
      orderid,
    });

    return data.data.orders;
  } catch (error) {}
};

export const orderslist = async (userid) => {
  try {
    const data = await axios.post("/api/checkout/myorders", {
      userId: userid,
    });

    return data.data.allorders;
  } catch (err) {}
};

///Delete all cart after success
export const removeallcart = async (userid) => {
  const result = await axios.post(`/api/carts/removecart`, {
    userId: userid,
  });

  return result;
};

////status update

export const status = async (orderid) => {
  const result = await axios.post(`/api/checkout/status`, {
    orderno: orderid,
  });

  return result;
};

//increment the count of discount used
export const increment = async (couponcode) => {
  const result = await axios.post(`/api/discount/increment`, {
    code: couponcode,
  });

  return result;
};

//dcrement the stcock in the payement

export const deccrementstockQuantity = async (productID, quantity) => {
  const { data } = await axios.post("/api/products/inventorydecrement", {
    productId: productID,
    quantity: quantity,
  });
};

export const CheckInventory = async (cartData, userId) => {
  const result = [];

  await Promise.all(
    cartData.map(async (cart, index) => {
      const { data } = await axios.get(`/api/products/${cart._id}`);
      if (data.Stock >= cart.quantity && data.status === "available") {
        result.push(cart);
      }
    })
  );

  if (result.length === 0) {
    //delete entire cart collection

    const { data } = await axios.post("/api/carts/deletedocumentcart", {
      userId: userId,
    });

    // result.push(data);
    return true;
  } else if (result.length !== cartData.length) {
    //Rewrite the product array in cart collection

    const { data } = await axios.get(`/api/carts/${userId}`);

    let final = [];
    data.products.forEach((e) => {
      result.forEach((e1) => {
        if (e.productId._id === e1._id) {
          final.push(e);
        }
      });
    });

    await axios.post("/api/carts/cartUpdates", {
      userId: userId,
      products: final,
    });

    return "hellow";
  } else {
    return false;
  }
  // return result;
};

////incrementinventory

export const incrementInventoryQuantity = async (productID, quantity) => {
  const { data } = await axios.post("/api/products/inventoryincrement", {
    productId: productID,
    quantity: quantity,
  });
};

export const deccrementInventoryQuantity = async (productID, quantity) => {
  const { data } = await axios.post("/api/products/inventorydecrement", {
    productId: productID,
    quantity: quantity,
  });
};

///upadate check qun in cart ...

export const updatecheckQuantity = async (userId, productId, qty, sku) => {
  const { data } = await axios.get(`/api/products/${productId}`);

  const bought =
    data.Stock > qty && qty > 0 && data.status === "available" && qty % 1 === 0;

  if (bought) {
    const { data } = await axios.put(`/api/carts/${userId}`, { sku, qty });
  } else {
    return (data.error = "Can't buy this quantity");
  }
};
