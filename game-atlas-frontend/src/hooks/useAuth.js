import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

export const useAuth = () => {
  const { login, logout, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setAuthLoading(true);
    try {
      const res = await authService.login(credentials);
      login(res.data.token, res.data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (data) => {
    setAuthLoading(true);
    try {
      const res = await authService.signup(data);
      login(res.data.token, res.data.user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async (googleToken) => {
    setAuthLoading(true);
    try {
      const res = await authService.googleLogin(googleToken);
      login(res.data.token, res.data.user);
      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return {
    user,
    loading,
    authLoading,
    handleLogin,
    handleSignup,
    handleGoogleLogin,
    handleLogout,
  };
};
