import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUrls, deleteUrl } from '../../store/slice/urlSlice';
import CopyButton from '../CopyButton';
import LoadingSpinner from '../LoadingSpinner';

const UrlList = () => {
  const dispatch = useDispatch();
  const { urls = [], loading, error } = useSelector(state => state.url);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUrls());
    }
  }, [dispatch, isAuthenticated]);

  const handleDelete = (urlId) => {
    dispatch(deleteUrl(urlId));
  };

  const getShortUrl = (code) => `${process.env.REACT_APP_REDIRECT_URL}/${code}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No URLs found. Create some!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {urls.map(url => (
        <div
          key={url._id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-900">Original URL</h3>
                <p className="text-gray-500 break-all">{url.originalUrl}</p>
              </div>
              <button
                onClick={() => handleDelete(url._id)}
                className="text-red-600 hover:text-red-800 transition-colors p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900">Short URL</h3>
              <div className="flex items-center space-x-2">
                <a 
                  href={getShortUrl(url.urlCode)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 break-all"
                >
                  {getShortUrl(url.urlCode)}
                </a>
                <CopyButton text={getShortUrl(url.urlCode)} />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-gray-600">{url.clicks} clicks</span>
              </div>
              <div className="text-gray-500 text-sm">
                Created: {new Date(url.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UrlList; 