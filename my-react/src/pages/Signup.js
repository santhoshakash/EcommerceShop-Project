import { useEffect, useState, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";

import { Header } from "./Header";
import { Link } from "react-router-dom";

import React from "react";

import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Usercontext } from "../context/Authcontext";

export const Signup = () => {
  const toastId = React.useRef(null);

  const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    position: toast.POSITION.TOP_CENTER,
    pauseOnHover: false,
    autoClose: 4000,
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signup } = useContext(Usercontext);

  const onSubmit = async (data) => {
    const email = data.email;
    setEmail(email);
    const password = data.password;
    setPassword(password);
    const passwordConfirm = data.confirmpasswords;
    setConfirmPassword(passwordConfirm);

    if (password !== passwordConfirm) {
      toast.error("Password does not match");
    } else {
      try {
        const data1 = await signup(email, password, passwordConfirm);

        toast.success(" New User signed in successfully");

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        const errors =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;

        toast.error("user Sign up fails,User Email already exists");
      }
    }
  };

  return (
    <section>
      <Header />
      <ToastContainer limit={1} position="top-center" autoClose={2000} />

      <div class="form-container sign-up-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Create Account</h1>

          <div class="form-control">
            <label for="name">Email Address</label>
            <input
              placeholder=""
              type="email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                },
              })}
            />
            {errors.email && <p class="error1">Please check the Email</p>}
          </div>
          <div class="form-control">
            <label for="name">Enter Password</label>
            <input
              placeholder=""
              type="password"
              {...register("password", {
                required: true,
                maxLength: 5,
              })}
            />
            {errors.password && <p class="error1">Please check the Password</p>}
          </div>
          <div class="form-control">
            <label for="name">Confirm Password</label>
            <input
              placeholder=""
              type="password"
              {...register("confirmpasswords", {
                required: true,
                maxLength: 5,
              })}
            />
            {errors.confirmpasswords && (
              <p class="error1">Please check the confirm Password</p>
            )}
          </div>
          <button class="button checkout_btn button--hollow">Sign Up</button>
        </form>
      </div>
    </section>
  );
};
