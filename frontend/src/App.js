import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/slice/authSlice";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import UrlsPage from "./pages/UrlsPage";
import ProfilePage from "./components/profile/ProfilePage";
import UrlList from "./components/urls/UrlList";
import HomePage from "./pages/HomePage";
import "./App.css";
import AuthGuard from "./components/auth/AuthGuard";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <Navigate to="/auth" replace />
                ) : (
                  <HomePage />
                )
              }
            />
            <Route
              path="/auth"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />
              }
            />
            <Route
              path="/urls"
              element={
                <AuthGuard>
                  <UrlsPage />
                </AuthGuard>
              }
            />
            <Route
              path="/url-list"
              element={
                <AuthGuard>
                  <UrlList />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <ProfilePage />
                </AuthGuard>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
