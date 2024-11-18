import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../../store/slice/authSlice';
import LoadingSpinner from '../LoadingSpinner';

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, accessToken } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated && accessToken) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated, accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default AuthGuard; 