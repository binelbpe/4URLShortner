import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createShortUrl, fetchUrls, deleteUrl } from "../store/slice/urlSlice";
import CopyButton from "../components/CopyButton";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/common/Modal";

const UrlsPage = () => {
  const [url, setUrl] = useState("");
  const [localError, setLocalError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);
  const [shortenedUrl, setShortenedUrl] = useState(null);
  
  const dispatch = useDispatch();
  const { urls, loading, error: serverError } = useSelector((state) => state.url);
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      dispatch(fetchUrls());
    }
  }, [dispatch, isAuthenticated, accessToken]);

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
      setUrl("");
      dispatch(fetchUrls()); // Refresh the list
    } catch (err) {
      setLocalError(err);
    }
  };

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

  if (loading && !urls.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* URL Creation Section */}
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

      {/* Recently Created URL */}
      {shortenedUrl && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Created URL</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <a
              href={getShortUrl(shortenedUrl.urlCode)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 break-all"
            >
              {getShortUrl(shortenedUrl.urlCode)}
            </a>
            <CopyButton 
              text={getShortUrl(shortenedUrl.urlCode)}
              className="flex-shrink-0"
            />
          </div>
        </div>
      )}

      {/* URLs List Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your URLs</h2>
          <span className="text-gray-500 text-sm">{urls.length} URLs total</span>
        </div>

        {urls.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No URLs yet</h3>
            <p className="mt-2 text-gray-500">Create your first shortened URL above</p>
          </div>
        ) : (
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
        )}
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete URL"
        message="Are you sure you want to delete this URL? This action cannot be undone."
      />
    </div>
  );
};

export default UrlsPage;
