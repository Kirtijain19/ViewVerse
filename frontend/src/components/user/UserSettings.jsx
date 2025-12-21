import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import '../../styles/UserSettings.css';

const UserSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData.data);
      setFormData({
        fullName: userData.data.fullName,
        email: userData.data.email,
        username: userData.data.username,
      });
    } catch (err) {
      setMessage('Failed to load user data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleCoverChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      if (avatar) formDataToSend.append('avatar', avatar);
      if (coverImage) formDataToSend.append('coverImage', coverImage);

      await userService.updateProfile(formDataToSend);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-settings">
      <h2>Account Settings</h2>
      
      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            name="username"
            value={formData.username}
            disabled
            className="disabled"
          />
        </div>

        <div className="form-group">
          <label>Avatar</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleAvatarChange}
          />
          {user?.avatar && <img src={user.avatar} alt="Current avatar" className="avatar-preview" />}
        </div>

        <div className="form-group">
          <label>Cover Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleCoverChange}
          />
          {user?.coverImage && <img src={user.coverImage} alt="Current cover" className="cover-preview" />}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default UserSettings;