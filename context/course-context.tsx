"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoContextProps {
  playingVideoId: string | null;
  currentModuleId: string | null;
  currentVideoId: string | null;
  setPlayingVideoId: (videoId: string | null) => void;
  setCurrentModuleId: (videoId: string | null) => void;
  setCurrentVideoId: (videoId: string | null) => void;
  watchedVideoIds: string[];
  addWatchedVideoId: (videoId: string) => void;
  removeWatchedVideoId: (videoId: string) => void;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [watchedVideoIds, setWatchedVideoIds] = useState<string[]>([]);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);


  const addWatchedVideoId = (videoId: string) => {
    setWatchedVideoIds(prev => Array.from(new Set([...prev, videoId])));
  };

  const removeWatchedVideoId = (videoId: string) => {
    setWatchedVideoIds(prev => prev.filter(id => id !== videoId));
  };

  return (
    <VideoContext.Provider
      value={{
        playingVideoId,
        setPlayingVideoId,
        watchedVideoIds,
        addWatchedVideoId,
        removeWatchedVideoId,
        currentModuleId,
        setCurrentModuleId,
        currentVideoId,
        setCurrentVideoId

      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};
