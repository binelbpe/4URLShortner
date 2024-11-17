import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createShortUrl } from '../store/slice/urlSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import CopyButton from '../components/CopyButton';

const HomePage = () => {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.url);
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
    setUrlError('');

    if (!validateUrl(url)) {
      setUrlError('Please enter a valid URL');
      return;
    }

    try {
      const result = await dispatch(createShortUrl({ originalUrl: url })).unwrap();
      setShortenedUrl(result);
      setUrl('');
    } catch (err) {
      console.error('Failed to shorten URL:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-primary-700 mb-8">
        Shorten Your URLs
      </h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL here"
            className="flex-1 px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Shorten URL'}
          </button>
        </div>
        {urlError && <p className="text-red-500 mt-2">{urlError}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {shortenedUrl && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Shortened URL</h2>
          <div className="flex items-center justify-center space-x-4">
            <a
              href={`${process.env.REACT_APP_REDIRECT_URL}/${shortenedUrl.urlCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700"
            >
              {`${process.env.REACT_APP_REDIRECT_URL}/${shortenedUrl.urlCode}`}
            </a>
            <CopyButton text={`${process.env.REACT_APP_REDIRECT_URL}/${shortenedUrl.urlCode}`} />
          </div>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-primary-700 mb-4">Fast & Easy</h3>
          <p className="text-gray-600">Shorten your URLs in seconds with our simple interface</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-primary-700 mb-4">Secure</h3>
          <p className="text-gray-600">Your URLs are safe and protected with our secure system</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-primary-700 mb-4">Track Clicks</h3>
          <p className="text-gray-600">Monitor your URL performance with click tracking</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 