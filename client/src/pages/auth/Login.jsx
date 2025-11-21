import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const res = await login(form);
    setLoading(false);
    
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message || "Invalid credentials");
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Welcome Back
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />

        {/* FIX: Added type="submit" here */}
        <Button className="w-full py-3" disabled={loading} type="submit">
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-slate-400 text-sm mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}