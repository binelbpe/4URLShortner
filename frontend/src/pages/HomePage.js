import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createShortUrl } from '../store/slice/urlSlice';
import CopyButton from '../components/CopyButton';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState(null);
  const dispatch = useDispatch();
  const { loading, error: serverError } = useSelector(state => state.url);
  const [shortenedUrl, setShortenedUrl] = useState(null);

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
      const result = await dispatch(createShortUrl({ originalUrl: url })).unwrap();
      setShortenedUrl(result);
      setUrl('');
    } catch (err) {
      setLocalError(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shorten Your URLs
        </h1>
        <p className="text-lg text-gray-600">
          Create short, memorable links in seconds
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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

      {shortenedUrl && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Shortened URL</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <a
              href={`${process.env.REACT_APP_REDIRECT_URL}/${shortenedUrl.urlCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 break-all"
            >
              {`${process.env.REACT_APP_REDIRECT_URL}/${shortenedUrl.urlCode}`}
            </a>
            <CopyButton 
              text={`${process.env.REACT_APP_REDIRECT_URL}/${shortenedUrl.urlCode}`}
              className="flex-shrink-0"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-2xl mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast & Easy</h3>
          <p className="text-gray-600">Create short URLs instantly with our simple interface</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-2xl mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure</h3>
          <p className="text-gray-600">Your URLs are safe and protected with our secure system</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-2xl mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Clicks</h3>
          <p className="text-gray-600">Monitor your URL performance with click tracking</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 