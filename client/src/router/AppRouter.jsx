import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";
import Subscriptions from "../pages/subscriptions/Subscriptions";

// ✅ IMPORT THE NEW FILE
import Reminders from "../pages/reminders/Reminders"; 
import ReminderSettings from "../pages/reminders/ReminderSettings";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950"></div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        
        {/* ✅ THE ROUTE IS RESTORED */}
        <Route path="/reminders" element={<Reminders />} />
        
        <Route path="/subscriptions/:id/reminder" element={<ReminderSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}