import React, { useEffect, useState } from "react";

import axios from "axios";

export const Usercontext = React.createContext({
  values: [],
  loading: Boolean,
  setdata: () => {},
  login: () => {},
  signup: () => {},
});

export const Authcontextprovider = (props) => {
  const [data, setdata] = useState();
  const [loading, setloading] = useState(false);

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios.defaults.withCredentials = true;

  const getsession = async () => {
    const { data } = await axios.get("/user/sessions");
    setdata(data);
    setloading(true);
  };

  const login = async (email, password) => {
    console.log(email, password);
    const { data } = await axios.post(
      `/api/users/login`,
      { email, password },
      config
    );
    console.log(data);
    setdata(data);
    // setloading(true);
    return data;
  };

  const signup = async (email, password, passwordConfirm) => {
    try {
      const { data } = await axios.post(
        `api/users/signup`,
        {
          email: email,
          password: password,
          passwordConfirm: passwordConfirm,
        },
        config
      );

      return data;
    } catch (error) {
      console.log(data.error);
    }
  };

  useEffect(() => {
    getsession();
  }, []);
  return (
    <Usercontext.Provider
      value={{
        values: data,
        loading: loading,
        setdata: setdata,
        login: login,
        signup: signup,
      }}
    >
      {props.children}
    </Usercontext.Provider>
  );
};
