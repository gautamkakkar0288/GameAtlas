import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Image as ImageIcon, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (file) data.append("profilePic", file);

    try {
      // Using import.meta.env.VITE_API_URL so it isn't hardcoded to localhost
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        body: data
      });
      const responseData = await res.json();
      if (res.ok) {
        toast.success("Account created! Please log in.");
        navigate("/login");
      } else {
        toast.error(responseData.msg || responseData.message || responseData.error || "Error signing up");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to sign up right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#04050F] font-sans text-slate-100 flex-row-reverse">
      {/* Right Side: Cinematic Image (Reversed layout for Signup) */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#04050F] z-10" />
        <img
          src="https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=1200&q=80"
          alt="Gaming World"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-12 right-12 z-20 max-w-md text-right">
          <h2 className="text-4xl font-black text-white drop-shadow-lg">Forge Your Legacy.</h2>
          <p className="mt-4 text-lg text-slate-300 drop-shadow-md">Join millions of players and build your ultimate gaming library today.</p>
        </div>
      </div>

      {/* Left Side: Signup Form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl sm:p-10"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-white">Create Account</h2>
            <p className="mt-2 text-slate-400">Join Game Atlas</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Display Name"
                className="w-full rounded-xl border border-white/10 bg-black/50 py-3.5 pl-11 pr-4 text-white outline-none focus:border-purple-500 focus:bg-black transition-colors"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full rounded-xl border border-white/10 bg-black/50 py-3.5 pl-11 pr-4 text-white outline-none focus:border-purple-500 focus:bg-black transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="w-full rounded-xl border border-white/10 bg-black/50 py-3.5 pl-11 pr-4 text-white outline-none focus:border-purple-500 focus:bg-black transition-colors"
              />
            </div>

            <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black/50 py-2.5 pl-4 pr-2">
              <div className="flex items-center gap-3 text-slate-400">
                <ImageIcon size={18} />
                <span className="text-sm">{file ? file.name : "Avatar (Optional)"}</span>
              </div>
              <input
                type="file"
                name="profilePic"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
              <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white pointer-events-none">Browse</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-black text-white transition-transform hover:scale-[1.02] disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <UserPlus size={18} />
              {submitting ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-purple-400 hover:text-purple-300 transition-colors">
              Log In
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Signup;