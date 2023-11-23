
import React from "react"
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = Cookies.get("user_token");

  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  else{
    return <Outlet/>
  }
};

export default PrivateRoute;
