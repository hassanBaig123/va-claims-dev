import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';

function VideoPreview({ url }: { url: string }) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const videoIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        let apiUrl: string;

        // Extract video ID based on URL structure
        if (url.includes('youtube.com')) {
          videoIdRef.current = url.split('v=')[1].split('&')[0];
          apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoIdRef.current}&key=YOUR_YOUTUBE_API_KEY&part=snippet`;
        } else if (url.includes('vimeo.com')) {
          videoIdRef.current = url.split('/')[3];
          apiUrl = `https://api.vimeo.com/videos/${videoIdRef.current}?fields=pictures`;
        } else {
          console.error('Unsupported video platform');
          return;
        }

        const response = await axios.get(apiUrl);
        const data = response.data;

        // Extract thumbnail URL based on platform
        let thumbnailUrl: string;
        if (data.items) {
          thumbnailUrl = data.items[0].snippet.thumbnails.default.url;
        } else if (data.pictures) {
          thumbnailUrl = data.pictures.sizes[0].link;
        } else {
          throw new Error('Thumbnail URL not found in API response');
        }

        setThumbnail(thumbnailUrl);
      } catch (error) {
        console.error('Error fetching thumbnail:', error);
      }
    };

    fetchThumbnail();
  }, [url]);

  return (
    <div>
      {thumbnail ? (
        <div style={{ position: 'relative', width: '120px', height: '90px' }}>
          <Image
            src={thumbnail}
            alt="Video Thumbnail"
            layout="fill"
            objectFit="cover"
          />
        </div>
      ) : (
        <p>Loading thumbnail...</p>
      )}
    </div>
  );
}

export default VideoPreview;