import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PlaylistCard.css';

const PlaylistCard = ({ playlist }) => {
  return (
    <Link to={`/playlist/${playlist._id}`} className="playlist-card-link">
      <div className="playlist-card">
        <div className="playlist-thumbnail">
          <img 
            src={playlist.videos[0]?.thumbnail || 'placeholder'} 
            alt={playlist.name}
          />
          <span className="video-count">{playlist.videos.length} videos</span>
        </div>
        
        <div className="playlist-info">
          <h3 className="playlist-name">{playlist.name}</h3>
          <p className="playlist-owner">{playlist.owner.fullName}</p>
          <p className="playlist-description">{playlist.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;