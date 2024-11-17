import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-primary-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-bold">URL Shortener</span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link
                  to="/urls"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive('/urls')
                      ? 'text-white bg-primary-700'
                      : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                  } rounded-md transition-colors duration-200`}
                >
                  Create URL
                </Link>
                <Link
                  to="/url-list"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive('/url-list')
                      ? 'text-white bg-primary-700'
                      : 'text-primary-100 hover:bg-primary-700 hover:text-white'
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
                    isActive('/profile')
                      ? 'text-white bg-primary-700'
                      : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                  } rounded-md transition-colors duration-200`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  isActive('/auth')
                    ? 'text-white bg-primary-700'
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                } rounded-md transition-colors duration-200`}
              >
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