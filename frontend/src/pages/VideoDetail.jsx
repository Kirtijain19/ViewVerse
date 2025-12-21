import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/video/VideoPlayer';
import CommentSection from '../components/comment/CommentSection';
import ChannelCard from '../components/user/ChannelCard';
import { API_BASE } from '../utils/constants';
import Sidebar from '../components/common/Sidebar';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/videos/${id}`);
      if (!res.ok) throw new Error('Failed to load video');
      const data = await res.json();
      setVideo(data.data || data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error loading video');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading video...</p>;
  if (error) return <p style={{ color: 'red', padding: 20 }}>{error}</p>;
  if (!video) return <p style={{ padding: 20 }}>Video not found</p>;

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 20 }}>
          <h1>{video.title}</h1>
          <VideoPlayer videoUrl={video.url || video.videoUrl || video.file} thumbnail={video.thumbnail} title={video.title} />

          <section style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <ChannelCard channel={video.owner} />
              <div>
                <p style={{ margin: 0 }}>{video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                <p style={{ marginTop: 8 }}>{video.description}</p>
              </div>
            </div>
          </section>

          <section style={{ marginTop: 32 }}>
            <CommentSection videoId={video._id || video.id} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default VideoDetail;