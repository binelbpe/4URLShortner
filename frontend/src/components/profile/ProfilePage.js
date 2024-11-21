import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearError, clearSuccessMessage, checkAuth } from '../../store/slice/authSlice';
import LoadingSpinner from '../LoadingSpinner';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [localError, setLocalError] = useState(null);
  const dispatch = useDispatch();
  const { user, loading, error: serverError, successMessage } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(checkAuth());
    }
 
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch, user]);

  useEffect(() => {
    if (serverError) {
      setLocalError(serverError);
      dispatch(clearError());
    }
  }, [serverError, dispatch]);

  const validateForm = () => {
    const errors = {};
    setLocalError(null);
    
    if (formData.newPassword || formData.currentPassword || formData.confirmNewPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = "Current password is required to change password";
      }
      if (formData.newPassword) {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.newPassword)) {
          errors.newPassword = "Password must be at least 8 characters and include uppercase, lowercase, number and special character";
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
          errors.confirmNewPassword = "Passwords do not match";
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    
    if (validateForm()) {
      try {
        const dataToUpdate = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        };
        
        await dispatch(updateProfile(dataToUpdate)).unwrap();
        
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      } catch (err) {
        setLocalError(err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setLocalError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
   
      {localError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {localError}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            disabled
          />
        </div>

        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formErrors.currentPassword 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }`}
          />
          {formErrors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{formErrors.currentPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formErrors.newPassword 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }`}
          />
          {formErrors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formErrors.confirmNewPassword 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }`}
          />
          {formErrors.confirmNewPassword && (
            <p className="mt-1 text-sm text-red-600">{formErrors.confirmNewPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? <LoadingSpinner /> : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage; 