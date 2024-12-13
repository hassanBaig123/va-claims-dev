import React from 'react';

interface YouTubeEmbedProps {
  videoLink: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({videoLink}) => {
  return (
    <iframe 
      style={{ width: '100%', height: '100%' }} 
      src={videoLink} 
      title="YouTube video player" 
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowFullScreen>
    </iframe>
  );
};

export default YouTubeEmbed;