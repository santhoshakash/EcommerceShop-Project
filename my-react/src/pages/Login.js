// import React from 'react'
import "../components/css/style.css";

import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { toast, ToastContainer } from "react-toastify";

import { Footer } from "./Footer";
import { Header } from "./Header";

import { Usercontext } from "../context/Authcontext";
import axios from "axios";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login, setdata } = useContext(Usercontext);

  const toastid = React.useRef(null);

  const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 4000,
  };
  const [userData, setUserData] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const navigate = useNavigate();

  const config = {
    // credentials: "include",

    headers: {
      "Content-Type": "application/json",
    },
  };
  axios.defaults.withCredentials = true;

  const fetchUserInfo = async () => {
    setdata(undefined);
    const { data } = await axios.get("/user/sessions");
    setUserData(data.user);

    if (!data.loggedIn) {
      navigate("/");
      return;
    }
    if (data.loggedIn) {
      if (data && data.Admin) {
        navigate("/admindashboard");
      } else if (data) {
        navigate("/collections");
      } else {
        navigate("/");
      }
    }

    return data;
  };

  const submitHandler = async (datas) => {
    const email = datas.email;
    const password = datas.password;
    try {
      const data = await login(email, password);

      if (data.Admin) {
        navigate("/admindashboard");
      } else if (!data.Admin) {
        navigate("/collections");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Invaild email or password");
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <>
      <Header />
      <ToastContainer limit={1} position="top-center" autoClose={2000} />

      {/* {error && <Message variant="alert-danger">{error}</Message>} */}
      {/* {loading && (<ReactLoading type={'spin'} color={'black'} height={'5%'} width={'5%'} />)} */}
      <section>
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit(submitHandler)}>
            <h1>Login</h1>
            <div className="form-control">
              <label htmlFor="name">Email Address</label>
              <input
                type="email"
                placeholder=""
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  },
                })}
              />
              {errors.email && (
                <p className="error1">Please enter the valid email id</p>
              )}
            </div>
            <div className="form-control">
              <label htmlFor="name">Enter Password</label>
              <input
                type="password"
                placeholder=""
                {...register("password", {
                  required: true,
                })}
              />{" "}
              {errors.password && (
                <p className="error1">Please enter the valid Password</p>
              )}
            </div>
            <button className="button button--hollow justify-end inline-block mb">
              Login
            </button>
          </form>
        </div>
      </section>

      {/* // </div> */}
    </>
  );
}
// export default Login;
