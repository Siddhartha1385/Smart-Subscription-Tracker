import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiBell, FiFileText, FiLogOut } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FiHome },
  { to: "/subscriptions", label: "Subscriptions", icon: FiFileText },
  { to: "/reminders", label: "Reminders", icon: FiBell },
];

export default function Sidebar({ variant = "desktop", onNavigate = () => {} }) {
  const { logout } = useAuth();

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col justify-between
        bg-slate-950 border-r border-white/5
        shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)] w-64 px-5 py-8 overflow-hidden relative`}
    >
      {/* 1. INNOVATION: Cinematic Background Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Top brand + nav */}
      <div className="relative z-10">
        {/* Brand Header */}
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
                {/* Logo */}
                <div className="relative w-10 h-10 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl blur-[8px] opacity-60" />
                    <div className="relative w-full h-full bg-slate-900 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                        <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-tr from-cyan-200 to-blue-400 relative z-10">
                            S
                        </span>
                    </div>
                </div>
                
                {/* Text Logo */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-lg font-bold text-white leading-none tracking-tight">
                        Smart<span className="text-cyan-400">.</span>Sub
                    </h1>
                </div>
            </div>

            {/* 2. INNOVATION: The "Manifesto" Layout */}
            {/* Instead of a boring subtitle, we use a vertical 'editorial' style layout */}
            <div className="flex items-center gap-3 pl-1">
                <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500/50 to-transparent rounded-full" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-slate-400 tracking-[0.25em] uppercase leading-tight">
                        Track Less
                    </span>
                    <span className="text-[10px] font-bold text-slate-100 tracking-[0.25em] uppercase leading-tight mt-0.5">
                        Live More
                    </span>
                </div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300
                   border border-transparent overflow-hidden
                   ${isActive 
                     ? "text-white bg-white/5 border-white/10 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]" 
                     : "text-slate-400 hover:text-cyan-100 hover:bg-white/5"
                   }`
                }
              >
                {({ isActive }) => (
                    <>
                        {/* Active Glow Indicator inside the button */}
                        {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_cyan]" />
                        )}

                        <div className={`
                            relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                            ${isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800/50 text-slate-500 group-hover:text-cyan-300 group-hover:bg-cyan-500/10"}
                        `}>
                            <Icon size={18} />
                        </div>
                        <span className="relative z-10 tracking-wide">{item.label}</span>
                    </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="relative z-10 pt-6 border-t border-white/5">
        <button
          onClick={() => logout("/login")}
          className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium 
                     text-slate-400 hover:text-rose-300 transition-all duration-300 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/50 group-hover:bg-rose-500/10 text-slate-500 group-hover:text-rose-400 transition-colors">
            <FiLogOut size={16} />
          </div>
          <span className="tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}