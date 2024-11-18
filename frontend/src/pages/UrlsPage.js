import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createShortUrl } from "../store/slice/urlSlice";
import CopyButton from "../components/CopyButton";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";

const UrlsPage = () => {
  const [url, setUrl] = useState("");
  const [localError, setLocalError] = useState(null);
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { error: serverError } = useSelector((state) => state.url);

  useEffect(() => {
    const fetchRecentUrls = async () => {
      try {
        const response = await api.get('/url/recent');
        setRecentUrls(response.data);
      } catch (error) {
        console.error('Failed to fetch recent URLs:', error);
      }
    };

    fetchRecentUrls();
  }, []);

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
    setLoading(true);

    if (!validateUrl(url)) {
      setLocalError('Please enter a valid URL');
      setLoading(false);
      return;
    }

    try {
      const result = await dispatch(createShortUrl({ originalUrl: url })).unwrap();
      setRecentUrls(prev => [result, ...prev]);
      setUrl("");
    } catch (err) {
      setLocalError(err);
    } finally {
      setLoading(false);
    }
  };

  const getShortUrl = (code) => `${process.env.REACT_APP_REDIRECT_URL}/${code}`;

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

      {/* Today's URLs Section */}
      {recentUrls.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Today's URLs</h2>
            <span className="text-sm text-gray-500">Created today</span>
          </div>

          <div className="space-y-4">
            {recentUrls.map((url, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="truncate text-sm text-gray-900">
                    {url.originalUrl}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={getShortUrl(url.urlCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      {getShortUrl(url.urlCode)}
                    </a>
                    <CopyButton 
                      text={getShortUrl(url.urlCode)}
                      className="scale-90"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(url.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <a 
              href="/url-list" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All URLs →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlsPage;
