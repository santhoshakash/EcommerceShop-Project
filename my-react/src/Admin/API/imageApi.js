import axios from "axios";

export const getimages = async (file) => {
  let form = new FormData();
  form.append("images", file);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const result = await axios.post(`/api/admin/addimage`, form, config);

  return result;
};

//discount
export const getalldiscount = async () => {
  const data = await axios(`api/admin/getalldiscount`);

  return data.data.discounts;
};

//ordersadmin

export const getallOrdersadmin = async () => {
  const data = await axios.get(`api/admin/getallorders`);

  return data.data.products;
};

export const getorderdetail = async (orderid) => {
  try {
    const data = await axios.post(`/api/admin/getorderdetails`, {
      orderid,
    });

    return data.data;
  } catch (error) {}
};

export const numberoforders = async (userId) => {
  try {
    const data = await axios.post(`/api/admin/numberoforder`, {
      userId: userId,
    });

    return data.data;
  } catch (error) {}
};

///admin products

//dashboard
export const getproductslist = async () => {
  try {
    const data = await axios.get("/api/admin/getallproducts");

    return data.data;
  } catch (error) {}
};

export const addproduct = async (products) => {
  try {
    const data = await axios.post(`/api/admin/addproduct`, { products });

    return data;
  } catch (error) {}
};

export const editproduct = async (products1) => {
  try {
    const { data } = await axios.post(`/api/admin/updateproduct`, {
      products1,
    });

    return data;
  } catch (error) {
    return error;
  }
};

export const getoneproduct = async (id) => {
  try {
    const { data } = await axios.get(`/api/admin/${id}`);

    return data;
  } catch (error) {}
};

///discount

export const getonediscountadmin = async (id) => {
  const data = await axios.get("/api/admin/getonediscount", { id: id });

  return data.discount;
};

//delete discounts in edit products

export const deletediscount = async (id) => {
  const { data } = await axios.post(`/api/admin/deletediscount`, {
    id: id,
  });

  // const data = await result.json();

  return data;
};
// logout

export const logoutcall = async () => {
  const result = await axios.post("/api/users/logout");
  return result;
  // setUserInfo(null)
};
