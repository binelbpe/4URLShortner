import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUrls, createShortUrl } from '../../store/slice/urlSlice';
import LoadingSpinner from '../LoadingSpinner';
import UrlList from './UrlList';
import { useState } from 'react';

const UrlListPage = () => {
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState(null);
  const dispatch = useDispatch();
  const { urls, loading, error: serverError } = useSelector(state => state.url);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUrls());
    }
  }, [dispatch, isAuthenticated]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!validateUrl(url)) {
      setLocalError('Please enter a valid URL');
      return;
    }

    try {
      await dispatch(createShortUrl({ originalUrl: url })).unwrap();
      setUrl('');
      dispatch(fetchUrls());
    } catch (err) {
      setLocalError(err);
    }
  };

  if (loading && !urls.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* URL Creation Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Short URL</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL here"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? <LoadingSpinner /> : 'Shorten URL'}
            </button>
          </div>
          {(localError || serverError) && (
            <p className="text-red-600 text-sm mt-2">{localError || serverError}</p>
          )}
        </form>
      </div>

      {/* URLs List Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your URLs</h2>
          <span className="text-gray-500 text-sm">{urls.length} URLs total</span>
        </div>

        <UrlList urls={urls} />
      </div>
    </div>
  );
};

export default UrlListPage; 