import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slice/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/auth");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-primary-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="4URL Logo" 
                className="h-8 w-auto"
              />
              <span className="text-white text-xl font-bold">
                4URL Shortener
              </span>
            </Link>

            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link
                  to="/urls"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive("/urls")
                      ? "text-white bg-primary-700"
                      : "text-primary-100 hover:bg-primary-700 hover:text-white"
                  } rounded-md transition-colors duration-200`}
                >
                  Create URL
                </Link>
                <Link
                  to="/url-list"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive("/url-list")
                      ? "text-white bg-primary-700"
                      : "text-primary-100 hover:bg-primary-700 hover:text-white"
                  } rounded-md transition-colors duration-200`}
                >
                  My URLs
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive("/profile")
                      ? "text-white bg-primary-700"
                      : "text-primary-100 hover:bg-primary-700 hover:text-white"
                  } rounded-md transition-colors duration-200`}
                >
                  <svg 
                    className="h-5 w-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white rounded-md transition-colors duration-200"
                >
                  <svg 
                    className="h-5 w-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  isActive("/auth")
                    ? "text-white bg-primary-700"
                    : "text-primary-100 hover:bg-primary-700 hover:text-white"
                } rounded-md transition-colors duration-200`}
              >
                <svg 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                  />
                </svg>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
