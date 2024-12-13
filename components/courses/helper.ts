export const handleThumbnailUrl = (url: string) => {
    try {
      if (url.startsWith('https://youtu.be/')) {
        const videoId = url.split('/')[3];
        return `https://img.youtube.com/vi/${videoId}/0.jpg`;
      }

      if (url.startsWith('https://vimeo.com/')) {
        const videoId = url.split('/')[3];
        return `https://vumbnail.com/${videoId}.jpg`;
      }
      console.warn('Unsupported video URL format');
      return '/icons/play-circle-02-stroke-rounded.svg';
    } catch (error) {
      console.error('Error generating thumbnail URL:', error);
      return '/icons/play-circle-02-stroke-rounded.svg';
    }
  };