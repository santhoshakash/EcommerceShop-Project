import { useEffect } from "react";
import axios from "axios";

export const Email = ({ order }) => {
  console.log(order);
  const emailas = async (order) => {
    console.log(order);
    const { data } = await axios.post("/user/orders/orderDetails", { order });
    console.log(data);
  };

  useEffect(() => {
    emailas(order);
  }, []);
  return <div>Hellow</div>;
};
