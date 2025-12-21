import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import likeService from '../../services/likeService';
import '../../styles/VideoCard.css';

const VideoCard = ({ video, onLike }) => {
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likeCount, setLikeCount] = useState(video.likesCount || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    try {
      if (isLiked) {
        await likeService.unlikeVideo(video._id);
        setLikeCount(likeCount - 1);
      } else {
        await likeService.likeVideo(video._id);
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);
      onLike && onLike(video._id);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views;
  };

  const formatDate = (date) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diff = now - videoDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <Link to={`/video/${video._id}`} className="video-card-link">
      <div className="video-card">
        <div className="video-thumbnail">
          <img src={video.thumbnail} alt={video.title} />
          <span className="video-duration">{video.duration}</span>
        </div>
        
        <div className="video-info">
          <img src={video.owner.avatar} alt={video.owner.username} className="channel-avatar-small" />
          
          <div className="video-details">
            <h3 className="video-title">{video.title}</h3>
            <p className="channel-name">{video.owner.fullName}</p>
            <div className="video-meta">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>

          <div className="video-actions">
            <button 
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              title="Like video"
            >
              ❤️ {likeCount}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;