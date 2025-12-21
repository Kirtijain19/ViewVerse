import React, { useState, useEffect } from 'react';
import commentService from '../../services/commentService';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';
import '../../styles/CommentSection.css';

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getVideoComments(videoId);
      setComments(data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(c => c._id !== commentId));
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(comments.map(c => c._id === updatedComment._id ? updatedComment : c));
  };

  if (loading) return <div className="loading">Loading comments...</div>;

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      
      <CommentForm 
        videoId={videoId}
        onCommentAdded={handleCommentAdded}
      />

      {error && <div className="error">{error}</div>}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <CommentCard 
              key={comment._id}
              comment={comment}
              onDelete={handleCommentDeleted}
              onUpdate={handleCommentUpdated}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;