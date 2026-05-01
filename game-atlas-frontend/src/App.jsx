import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AuthProvider } from "./context/AuthContext";
import { selectAuthLoading, selectInitialized, selectUser, fetchCurrentUser, setInitialized } from "./store/slices/authSlice";
import { Navbar, LoadingSpinner } from "./components";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import GameDetails from "./pages/GameDetails";
import CloudGaming from "./pages/CloudGaming";
import Wishlist from "./pages/Wishlist";
import Friends from "./pages/Friends";
import NotFound from "./pages/NotFound";

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const initialized = useSelector(selectInitialized);

  // Safety net: if somehow stuck in uninitialized + not-loading state, unblock the route
  useEffect(() => {
    if (!initialized && !loading) dispatch(setInitialized());
  }, [initialized, loading, dispatch]);

  // Only block during the very first boot check (not initialized AND still loading)
  if (!initialized && loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" replace />;
};

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const dispatch = useDispatch();
  const initialized = useSelector(selectInitialized);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Always re-fetch on mount
      dispatch(fetchCurrentUser());
    } else {
      // No token — immediately mark as initialized so ProtectedRoute redirects to /login
      dispatch(setInitialized());
    }
  }, [dispatch]); // Only run on mount

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/cloud" element={<CloudGaming />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


