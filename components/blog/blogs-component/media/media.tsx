import React from 'react'

interface MediaComponentProps
  extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  url?: string
}

const MediaComponent: React.FC<MediaComponentProps> = ({ url, ...props }) => {
  const videoUrl = url || props.src

  return (
    <div className="my-5">
      {' '}
      <iframe
        src={videoUrl}
        {...props}
        className="w-full h-80 border-none"
        title="Media Content"
      />
    </div>
  )
}

export default MediaComponent
