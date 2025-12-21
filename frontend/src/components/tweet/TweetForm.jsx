import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import tweetService from '../../services/tweetService';
import '../../styles/TweetForm.css';

const TweetForm = ({ onTweetAdded }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Tweet cannot be empty');
      return;
    }

    if (content.length > 280) {
      setError('Tweet must be 280 characters or less');
      return;
    }

    try {
      setSubmitting(true);
      const response = await tweetService.createTweet(content);
      onTweetAdded(response.data);
      setContent('');
      setError('');
    } catch (err) {
      setError('Failed to post tweet');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="tweet-form-login">
        <p>Please log in to tweet</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="tweet-form">
      <img src={user.avatar} alt={user.username} className="avatar" />
      
      <div className="form-content">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?!"
          rows="3"
          maxLength="280"
        />
        
        <div className="form-footer">
          <span className={`char-count ${content.length > 240 ? 'warning' : ''}`}>
            {content.length}/280
          </span>
          
          {error && <div className="error">{error}</div>}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={submitting || !content.trim()}
            className="submit-btn"
          >
            {submitting ? 'Posting...' : 'Tweet'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TweetForm;