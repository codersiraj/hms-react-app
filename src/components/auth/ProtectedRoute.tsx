// src/components/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  console.log("token", token);
  if (!token) {
    console.log("hit1");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // ✅ render child routes when authenticated
}
