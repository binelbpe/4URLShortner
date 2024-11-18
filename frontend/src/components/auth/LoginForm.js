import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearError } from "../../store/slice/authSlice";
import ErrorMessage from "../common/ErrorMessage";

const LoginForm = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [localError, setLocalError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: serverError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (serverError) {
      setLocalError(serverError);
    }
  }, [serverError]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      setLocalError(null);
    };
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};
    setLocalError(null);

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,}$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (validateForm()) {
      try {
        await dispatch(login(formData)).unwrap();
        navigate("/");
      } catch (err) {
        setLocalError(err);
        console.error("Login failed:", err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setLocalError(null);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Sign In
      </h2>

      {localError && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formErrors.email
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            }`}
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              formErrors.password
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            }`}
          />
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6">
        <button
          onClick={onToggleForm}
          className="w-full text-center text-sm text-primary-600 hover:text-primary-500"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
