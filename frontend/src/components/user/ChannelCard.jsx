import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ChannelCard.css';

const ChannelCard = ({ channel, onSubscribe, isSubscribed }) => {
  return (
    <div className="channel-card">
      <Link to={`/channel/${channel._id}`} className="channel-link">
        <img src={channel.avatar} alt={channel.username} className="channel-avatar" />
        <div className="channel-info">
          <h3 className="channel-name">{channel.fullName}</h3>
          <p className="channel-username">@{channel.username}</p>
          <p className="channel-subscribers">
            {channel.subscribersCount || 0} subscribers
          </p>
        </div>
      </Link>
      <button 
        className={`subscribe-btn-small ${isSubscribed ? 'subscribed' : ''}`}
        onClick={() => onSubscribe(channel._id)}
      >
        {isSubscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
};

export default ChannelCard;