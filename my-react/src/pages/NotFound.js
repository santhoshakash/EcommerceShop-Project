import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import axios from "axios";

export const NotFound = () => {
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const fetchUserInfo = async () => {
    const { data } = await axios.get("/user/sessions");

    if (!data.loggedIn) {
      setloading(false);
      navigate("/");
    }
    if (data.loggedIn) {
      if (data.isAdmin) {
        navigate("/admindashboard");
      } else if (!data.isAdmin) {
        navigate("/collections");
      } else {
        navigate("/");
      }
      setloading(false);
    }
  };

  return (
    <>
      {" "}
      {!loading && (
        <div>
          <img
            style={{ width: "100%", height: "600px", objectFit: "contain" }}
            src="/images/notfound.jpg"
            alt="Not-found"
          />
          <button onClick={fetchUserInfo}>HomePage</button>
          {/ homeComponents /}
        </div>
      )}
    </>
  );
};
