import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This stops the page from reloading
    setError("");
    
    if(!form.name || !form.email || !form.password) {
        setError("All fields are required");
        return;
    }

    setLoading(true);
    
    try {
        const res = await register(form);
        if (res.success) {
            navigate("/dashboard"); // Redirect on success
        } else {
            setError(res.message || "Registration failed");
        }
    } catch (err) {
        setError("Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-semibold text-white mb-2 text-center">
        Create Account
      </h2>
      <p className="text-slate-400 text-sm text-center mb-6">
        Start tracking your subscriptions today
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          name="name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
        />

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

        {/* FIX: Added type="submit" to ensure it fires the form onSubmit */}
        <Button className="w-full py-3" disabled={loading} type="submit">
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>

      <p className="text-center text-slate-400 text-sm mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}