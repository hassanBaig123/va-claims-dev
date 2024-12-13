'use client'

import React, { useRef } from 'react'
import ReactPlayer from 'react-player'

interface VideoComponentProps {
  url: string | ''
}

const VideoComponent: React.FC<VideoComponentProps> = ({ url }) => {
  const playerRef = useRef<any>(null)

  return (
    <div className="w-full min-w-[300px] sm:min-w-[380px] h-[300px] lg:h-[400px] mx-auto relative rounded-lg">
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        controls
        className="react-player"
      />
    </div>
  )
}

export default VideoComponent
