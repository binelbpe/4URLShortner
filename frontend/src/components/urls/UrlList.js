import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUrls, deleteUrl } from '../../store/slice/urlSlice';
import CopyButton from '../CopyButton';
import LoadingSpinner from '../LoadingSpinner';
import Modal from '../common/Modal';

const UrlList = () => {
  const dispatch = useDispatch();
  const { urls = [], loading, error } = useSelector(state => state.url);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUrls());
    }
  }, [dispatch, isAuthenticated]);

  const handleDeleteClick = (urlId) => {
    setUrlToDelete(urlId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (urlToDelete) {
      await dispatch(deleteUrl(urlToDelete));
      setDeleteModalOpen(false);
      setUrlToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setUrlToDelete(null);
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
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No URLs found</h3>
          <p className="mt-2 text-gray-500">Get started by creating your first shortened URL</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Shortened URLs</h2>
          <p className="text-gray-600 mb-4">Manage and track all your shortened URLs in one place</p>
          
          <div className="grid gap-6">
            {urls.map(url => (
              <div
                key={url._id}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex-grow space-y-1">
                      <h3 className="text-sm font-medium text-gray-500">Original URL</h3>
                      <p className="text-gray-900 break-all">{url.originalUrl}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(url._id)}
                      className="flex items-center text-red-600 hover:text-red-800 transition-colors p-2 rounded-md hover:bg-red-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="ml-2 hidden md:inline">Delete</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Short URL</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a 
                        href={getShortUrl(url.urlCode)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 break-all"
                      >
                        {getShortUrl(url.urlCode)}
                      </a>
                      <CopyButton 
                        text={getShortUrl(url.urlCode)} 
                        className="flex-shrink-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-gray-600">{url.clicks} clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">
                        Created: {new Date(url.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete URL"
        message="Are you sure you want to delete this URL? This action cannot be undone."
      />
    </>
  );
};

export default UrlList; 