import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUrls } from '../../store/slice/urlSlice';
import LoadingSpinner from '../LoadingSpinner';
import UrlList from './UrlList';

const UrlListPage = () => {
  const dispatch = useDispatch();
  const { urls, loading, error } = useSelector(state => state.url);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUrls());
    }
  }, [dispatch, isAuthenticated]);

  // Show loading only on initial load
  if (loading && !urls.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Show empty state if no URLs
  if (!urls || urls.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No URLs found</h3>
          <p className="mt-2 text-gray-500">Create your first shortened URL to get started!</p>
          <a 
            href="/urls" 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            Create URL
          </a>
        </div>
      </div>
    );
  }

  // Show URL list
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My URLs</h2>
          <span className="text-sm text-gray-500">{urls.length} URLs total</span>
        </div>
        <UrlList urls={urls} />
      </div>
    </div>
  );
};

export default UrlListPage; 