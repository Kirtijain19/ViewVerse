import React from 'react';
import Sidebar from '../components/common/Sidebar';
import VideoUpload from '../components/video/VideoUpload';

const Upload = () => {
  const handleSuccess = (data) => {
    // optionally navigate or show notification after upload
    console.log('Uploaded', data);
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 20 }}>
          <VideoUpload onUploadSuccess={handleSuccess} />
        </main>
      </div>
    </div>
  );
};

export default Upload;
