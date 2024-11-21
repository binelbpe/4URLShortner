import React, { useEffect, useState } from "react";
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
import UrlListPage from "./components/urls/UrlListPage";
import ProfilePage from "./components/profile/ProfilePage";
import LoadingSpinner from "./components/LoadingSpinner";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        if (localStorage.getItem('tokens')) {
          await dispatch(checkAuth()).unwrap();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkAuthentication();
  }, [dispatch]);

  if (!initialCheckDone) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/auth"
              element={isAuthenticated ? <Navigate to="/urls" /> : <AuthPage />}
            />
            <Route
              path="/urls"
              element={isAuthenticated ? <UrlsPage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/url-list"
              element={isAuthenticated ? <UrlListPage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/"
              element={<Navigate to={isAuthenticated ? "/urls" : "/auth"} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
