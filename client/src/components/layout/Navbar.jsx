// src/components/layout/Navbar.jsx
import React from "react";
import { FiUser, FiMenu } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // <--- Import the Auth Hook

const TITLE_BY_PATH = {
  "/": "Dashboard",
  "/subscriptions": "Subscriptions",
  "/reminders": "Reminders",
};

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const { user } = useAuth(); // <--- Get the user data
  
  const title = TITLE_BY_PATH[location.pathname] || "Smart Subscriptions";

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 pt-4 pb-3 bg-gradient-to-b from-slate-950/75 via-slate-950/40 to-transparent backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: mobile menu + breadcrumb/title */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/70 border border-slate-700/70 shadow-md shadow-cyan-500/30 hover:border-cyan-400/80 hover:shadow-cyan-400/50 transition"
            onClick={onToggleSidebar}
          >
            <FiMenu className="text-cyan-300" size={18} />
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Smart Subscriptions
            </p>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-50">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: user chip */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-400">Signed in as</span>
            {/* FIX: Display dynamic user name */}
            <span className="text-sm font-medium text-slate-50">
              {user?.name || "User"}
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-gradient-to-tr from-cyan-400/40 via-indigo-500/40 to-fuchsia-400/40 opacity-80" />
            <div className="relative w-10 h-10 rounded-full bg-slate-900/80 border border-cyan-300/70 flex items-center justify-center text-cyan-200 shadow-lg shadow-cyan-400/70">
              {user?.picture ? (
                 <img src={user.picture} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                 <FiUser size={18} />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}