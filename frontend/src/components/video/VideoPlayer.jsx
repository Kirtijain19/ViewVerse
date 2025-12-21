import React, { useEffect, useRef } from 'react';
import '../../styles/VideoPlayer.css';

const VideoPlayer = ({ videoUrl, thumbnail, title }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Initialize video player
    const video = videoRef.current;
    if (video) {
      video.poster = thumbnail;
    }
  }, [thumbnail]);

  return (
    <div className="video-player-container">
      <video 
        ref={videoRef}
        controls
        controlsList="nodownload"
        className="video-player"
        title={title}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;