import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import tweetService from '../../services/tweetService';
import likeService from '../../services/likeService';
import '../../styles/TweetCard.css';

const TweetCard = ({ tweet, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);
  const [isLiked, setIsLiked] = useState(tweet.isLiked || false);
  const [likeCount, setLikeCount] = useState(tweet.likesCount || 0);

  const isOwner = user?._id === tweet.owner._id;

  const handleDelete = async () => {
    if (window.confirm('Delete this tweet?')) {
      try {
        await tweetService.deleteTweet(tweet._id);
        onDelete(tweet._id);
      } catch (err) {
        console.error('Failed to delete tweet:', err);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await tweetService.updateTweet(tweet._id, editedContent);
      onUpdate(updated.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update tweet:', err);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await likeService.unlikeTweet(tweet._id);
        setLikeCount(likeCount - 1);
      } else {
        await likeService.likeTweet(tweet._id);
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const tweetDate = new Date(date);
    const diff = now - tweetDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours === 0) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return Math.floor(hours / 24) + 'd ago';
  };

  return (
    <div className="tweet-card">
      <img src={tweet.owner.avatar} alt={tweet.owner.username} className="avatar" />
      
      <div className="tweet-content">
        <div className="tweet-header">
          <p className="username">{tweet.owner.fullName}</p>
          <p className="handle">@{tweet.owner.username}</p>
          <p className="time">{formatDate(tweet.createdAt)}</p>
        </div>

        {isEditing ? (
          <div className="edit-form">
            <textarea 
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="edit-buttons">
              <button onClick={handleUpdate} className="save-btn">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="tweet-text">{tweet.content}</p>
        )}

        <div className="tweet-actions">
          <button 
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            ❤️ {likeCount}
          </button>
          
          {isOwner && (
            <>
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard;