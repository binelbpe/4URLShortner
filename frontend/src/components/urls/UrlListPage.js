import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUrls, deleteUrl } from '../../store/slice/urlSlice';
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

  const handleDelete = (urlId) => {
    dispatch(deleteUrl(urlId));
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My URLs</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {urls.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
          <p className="text-gray-500">Start shortening URLs to see them here.</p>
        </div>
      ) : (
        <UrlList urls={urls} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default UrlListPage; 