import React from "react"

import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import LoginPage from "../pages/auth/LoginPage";
import Layouts from "../layout/Layout";
import Children from "../pages/Children/Children";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layouts />}>
            <Route index element={<Dashboard />} />
            <Route path="/customers" index element={<Children />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
