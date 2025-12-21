import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import subscriptionService from '../../services/subscriptionService';
import '../../styles/UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    subscribers: 0,
    videos: 0,
    playlists: 0,
  });

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUserProfile(userId);
      setUser(userData.data);
      
      // Fetch subscription status
      const subStatus = await subscriptionService.checkSubscription(userId);
      setIsSubscribed(subStatus.data.isSubscribed);
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      if (isSubscribed) {
        await subscriptionService.unsubscribe(userId);
      } else {
        await subscriptionService.subscribe(userId);
      }
      setIsSubscribed(!isSubscribed);
    } catch (err) {
      setError('Failed to update subscription');
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={user.avatar || 'placeholder'} alt={user.username} className="avatar-large" />
        <div className="profile-info">
          <h1>{user.fullName}</h1>
          <p className="username">@{user.username}</p>
          <p className="email">{user.email}</p>
          {user.coverImage && <img src={user.coverImage} alt="cover" className="cover-image" />}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat">
          <h3>{stats.videos}</h3>
          <p>Videos</p>
        </div>
        <div className="stat">
          <h3>{stats.subscribers}</h3>
          <p>Subscribers</p>
        </div>
        <div className="stat">
          <h3>{stats.playlists}</h3>
          <p>Playlists</p>
        </div>
      </div>

      <div className="profile-actions">
        <button 
          className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
          onClick={handleSubscribe}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>
        <button className="share-btn">Share</button>
      </div>

      <div className="profile-description">
        <h3>About</h3>
        <p>{user.description || 'No description provided'}</p>
      </div>
    </div>
  );
};

export default UserProfile;