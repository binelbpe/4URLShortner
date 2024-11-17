import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createShortUrl, fetchUrls, deleteUrl } from '../store/slice/urlSlice';
import CopyButton from '../components/CopyButton';
import LoadingSpinner from '../components/LoadingSpinner';

const UrlsPage = () => {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();
  const { urls, loading, error } = useSelector(state => state.url);
  const { isAuthenticated, accessToken } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      dispatch(fetchUrls());
    }
  }, [dispatch, isAuthenticated, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createShortUrl({ originalUrl: url }));
    setUrl('');
  };

  const handleDelete = (urlId) => {
    dispatch(deleteUrl(urlId));
  };

  // Function to get the full shortened URL using environment variable
  const getShortUrl = (code) => `${process.env.REACT_APP_REDIRECT_URL}/${code}`;

  if (loading && !urls.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to shorten"
            className="input flex-1"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary whitespace-nowrap"
          >
            {loading ? 'Creating...' : 'Shorten URL'}
          </button>
        </div>
        {error && (
          <div className="mt-2 text-red-600">{error}</div>
        )}
      </form>

      <div className="space-y-4">
        {urls.map(url => (
          <div
            key={url._id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div className="space-y-2">
              <div className="text-sm text-gray-500 truncate">
                Original: {url.originalUrl}
              </div>
              <div className="text-primary flex items-center">
                Short: 
                <a 
                  href={getShortUrl(url.urlCode)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 hover:underline"
                >
                  {getShortUrl(url.urlCode)}
                </a>
                <CopyButton text={getShortUrl(url.urlCode)} />
              </div>
              <div className="text-sm text-gray-500">
                Clicks: {url.clicks}
              </div>
            </div>
            <button
              onClick={() => handleDelete(url._id)}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlsPage; 