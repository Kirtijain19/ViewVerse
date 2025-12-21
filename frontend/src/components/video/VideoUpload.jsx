import React, { useState } from 'react';
import videoService from '../../services/videoService';
import '../../styles/VideoUpload.css';

const VideoUpload = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPublished: true,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setError('');
    } else {
      setError('Please select a valid video file');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnail(file);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }
    if (!thumbnail) {
      setError('Please select a thumbnail image');
      return;
    }

    try {
      setUploading(true);
      
      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('isPublished', formData.isPublished);
      uploadFormData.append('videoFile', videoFile);
      uploadFormData.append('thumbnail', thumbnail);

      const response = await videoService.uploadVideo(uploadFormData);
      
      setFormData({ title: '', description: '', isPublished: true });
      setVideoFile(null);
      setThumbnail(null);
      setProgress(0);
      
      onUploadSuccess && onUploadSuccess(response.data);
      setError('');
    } catch (err) {
      console.error('video upload error', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="video-upload">
      <h2>Upload Video</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Video Title *</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter video title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter video description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Video File *</label>
          <input 
            type="file" 
            accept="video/*"
            onChange={handleVideoChange}
            required
          />
          {videoFile && <p className="file-name">Selected: {videoFile.name}</p>}
        </div>

        <div className="form-group">
          <label>Thumbnail *</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleThumbnailChange}
            required
          />
          {thumbnail && <p className="file-name">Selected: {thumbnail.name}</p>}
        </div>

        <div className="form-group checkbox">
          <input 
            type="checkbox" 
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleInputChange}
            id="publish-checkbox"
          />
          <label htmlFor="publish-checkbox">Publish immediately</label>
        </div>

        {uploading && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;