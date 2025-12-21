import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import commentService from '../../services/commentService';
import '../../styles/CommentForm.css';

const CommentForm = ({ videoId, onCommentAdded }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      const response = await commentService.createComment(videoId, content);
      onCommentAdded(response.data);
      setContent('');
      setError('');
    } catch (err) {
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="comment-form-login">
        <p>Please log in to comment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <img src={user.avatar} alt={user.username} className="avatar" />
      
      <div className="form-content">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          rows="2"
        />
        
        {error && <div className="error">{error}</div>}
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={submitting || !content.trim()}
            className="submit-btn"
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;