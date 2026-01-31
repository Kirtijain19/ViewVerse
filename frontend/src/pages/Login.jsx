import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-900 bg-slate-900/70 p-8">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to manage your studio.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <Input name="username" value={form.username} onChange={handleChange} placeholder="Username (optional)" />
          <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          New to ViewVerse? <Link to="/register" className="text-brand-300">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
