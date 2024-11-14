import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/auth');
  };

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-white text-xl font-bold">URL Shortener</Link>
          
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200 transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="text-white hover:text-gray-200 transition-colors duration-200"
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