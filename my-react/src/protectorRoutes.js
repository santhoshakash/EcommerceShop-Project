import React, { useContext, useEffect, useState } from "react";

import { Navigate } from "react-router";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Usercontext } from "./context/Authcontext";
import { Loading } from "./loading";

export const Authenticateuser = ({ component: ReactComponent }) => {
  const { values, loading } = useContext(Usercontext);

  if (loading && !values.loggedIn) {
    return <Navigate to="/" />;
  }

  if (!loading) {
    return <Loading />;
  } else if (values && !values.Admin) {
    return <ReactComponent />;
  } else if (values && values.Admin) {
    return <NotFound />;
  } else {
    return <Login />;
  }
};
export const AuthenticateAdmin = ({ component: ReactComponent }) => {
  const { values, loading } = useContext(Usercontext);

  if (loading && !values.loggedIn) {
    return <Navigate to="/" />;
  }

  if (!loading) {
    return <div>.</div>;
  } else if (values && values.Admin) {
    return <ReactComponent />;
  } else if (values && !values.Admin) {
    return <NotFound />;
  } else {
    return <Navigate to="/" />;
  }
};
