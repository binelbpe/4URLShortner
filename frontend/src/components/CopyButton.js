import React, { useState } from 'react';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-sm text-gray-500 hover:text-primary transition-colors duration-200"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default CopyButton; 