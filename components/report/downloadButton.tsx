// src/components/DownloadButton.tsx

import React from 'react';

interface DownloadButtonProps {
  onDownload: () => void;
}

const DownloadButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return <button onClick={onClick}>Download Nexus Letter</button>;
  };

export default DownloadButton;