import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUrls, deleteUrl } from '../../store/slice/urlSlice';
import CopyButton from '../CopyButton';
import Modal from '../common/Modal';

const ITEMS_PER_PAGE = 5; 

const UrlList = () => {
  const dispatch = useDispatch();
  const { urls = [] } = useSelector(state => state.url);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [urlToDelete, setUrlToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUrls());
    }
  }, [dispatch, isAuthenticated]);

  const getShortUrl = (code) => `${process.env.REACT_APP_REDIRECT_URL}/${code}`;

  const handleShowDetails = (url) => {
    setSelectedUrl(url);
    setDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailsModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedUrl(null);
    setUrlToDelete(null);
  };

  const handleDeleteClick = (url) => {
    setUrlToDelete(url._id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (urlToDelete) {
      await dispatch(deleteUrl(urlToDelete));
      setDeleteModalOpen(false);
      setUrlToDelete(null);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(urls.length / ITEMS_PER_PAGE);
  const indexOfLastUrl = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUrl = indexOfLastUrl - ITEMS_PER_PAGE;
  const currentUrls = urls.slice(indexOfFirstUrl, indexOfLastUrl);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (!urls || urls.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No URLs found. Create some!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {currentUrls.map(url => (
          <div
            key={url._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="flex-grow space-y-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Original URL</h3>
                    <p className="text-gray-900 break-all">{url.originalUrl}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Short URL</h3>
                    <div className="flex items-center gap-2">
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
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{url.clicks} clicks</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleShowDetails(url)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100"
                    >
                      Analytics
                      <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(url)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                    >
                      Delete
                      <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 border-t pt-2">
                Created: {new Date(url.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === index + 1
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      )}

      {/* Analytics Modal */}
      {selectedUrl && detailsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCloseModal}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Analytics for {getShortUrl(selectedUrl.urlCode)}
                    </h3>
                    <div className="mt-4 max-h-96 overflow-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Browser</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OS</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedUrl.clickDetails?.slice().reverse().map((click, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(click.timestamp).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {click.device}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                {click.browser}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {click.os}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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