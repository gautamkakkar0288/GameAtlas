import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, fetchCurrentUser, setCredentials } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      // Fetch user then set credentials in Redux — avoids race with App.jsx's own fetchCurrentUser
      dispatch(fetchCurrentUser()).then((action) => {
        if (action.meta.requestStatus === "fulfilled") {
          // setCredentials is already handled inside fetchCurrentUser.fulfilled in authSlice,
          // but we also update the Context layer for components that still read from it.
          login(urlToken, action.payload);
          toast.success("Logged in with Google!");
          navigate("/", { replace: true });
        } else {
          localStorage.removeItem("token");
          toast.error("Google login failed. Please try again.");
        }
      });
    }
  }, []); // run once on mount only

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      login(result.payload.token, result.payload.user);
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error(result.payload || "Login failed");
    }
    setSubmitting(false);
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <main className="flex min-h-screen bg-[#04050F] font-sans text-slate-100">
      {/* Left Side: Cinematic Image */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#04050F] z-10" />
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
          alt="Gaming Setup"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <h2 className="text-4xl font-black text-white drop-shadow-lg">Continue Your Journey.</h2>
          <p className="mt-4 text-lg text-slate-300 drop-shadow-md">Access your library, connect with friends, and discover new worlds.</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl sm:p-10"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-white">Welcome Back</h2>
            <p className="mt-2 text-slate-400">Log in to Game Atlas</p>
          </div>

          <button
            onClick={handleGoogle}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3.5 font-bold text-white transition-all hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5" />
            Continue with Google
          </button>

          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Or email</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 font-black text-white transition-transform hover:scale-[1.02] disabled:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              <LogIn size={18} />
              {submitting ? "Authenticating..." : "Log In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;