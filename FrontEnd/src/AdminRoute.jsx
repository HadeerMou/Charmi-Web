import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const userType = localStorage.getItem("userType");

  if (userType !== "ADMIN") {
    return <Navigate to="/" replace />; // Redirect non-admin users to the homepage
  }

  return <Outlet />; // Render the nested routes if admin
};

export default AdminRoute;
