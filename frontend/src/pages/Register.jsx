import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullname: "", username: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (avatar) payload.append("avatar", avatar);
    if (coverImage) payload.append("coverImage", coverImage);

    try {
      await register(payload);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-900 bg-slate-900/70 p-8">
        <h1 className="text-2xl font-semibold">Create your channel</h1>
        <p className="mt-2 text-sm text-slate-400">Bring your content to ViewVerse.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input name="fullname" value={form.fullname} onChange={handleChange} placeholder="Full name" />
          <Input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
          <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-400">
              Avatar
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setAvatar(event.target.files?.[0])}
                className="block w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-300"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-400">
              Cover image
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setCoverImage(event.target.files?.[0])}
                className="block w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-300"
              />
            </label>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Button type="submit" className="w-full">Create account</Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
