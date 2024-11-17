import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../../store/slice/authSlice';
import LoadingSpinner from '../LoadingSpinner';

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    const verifyAuth = async () => {
      const result = await dispatch(checkAuth()).unwrap();
      if (!result) {
        navigate('/auth');
      }
    };

    verifyAuth();
  }, [dispatch, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : null;
};

export default AuthGuard; 