import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import commentService from '../../services/commentService';
import likeService from '../../services/likeService';
import '../../styles/CommentCard.css';

const CommentCard = ({ comment, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likesCount || 0);

  const isOwner = user?._id === comment.owner._id;

  const handleDelete = async () => {
    if (window.confirm('Delete this comment?')) {
      try {
        await commentService.deleteComment(comment._id);
        onDelete(comment._id);
      } catch (err) {
        console.error('Failed to delete comment:', err);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await commentService.updateComment(comment._id, editedContent);
      onUpdate(updated.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await likeService.unlikeComment(comment._id);
        setLikeCount(likeCount - 1);
      } else {
        await likeService.likeComment(comment._id);
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diff = now - commentDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours === 0) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return Math.floor(hours / 24) + 'd ago';
  };

  return (
    <div className="comment-card">
      <img src={comment.owner.avatar} alt={comment.owner.username} className="avatar" />
      
      <div className="comment-content">
        <div className="comment-header">
          <p className="username">{comment.owner.fullName}</p>
          <p className="time">{formatDate(comment.createdAt)}</p>
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
          <p className="comment-text">{comment.content}</p>
        )}

        <div className="comment-actions">
          <button 
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            👍 {likeCount}
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

export default CommentCard;