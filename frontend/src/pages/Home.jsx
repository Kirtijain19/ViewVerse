// import React, { useEffect, useState } from 'react';
// import VideoCard from '../components/video/VideoCard';
// import Sidebar from '../components/common/Sidebar';
// import videoService from '../services/videoService';

// const Home = () => {
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => { fetchVideos(); }, []);

//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       const data = await videoService.getAllVideos();
//       // videoService returns parsed json; backend wraps in ApiResponse
//       setVideos(data.data || data || []);
//       setError('');
//     } catch (err) {
//       setError(err.message || 'Error loading videos');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div style={{ display: 'flex' }}>
//         <Sidebar />
//         <main style={{ flex: 1, padding: 20 }}>
//           <h2>Trending</h2>

//           {loading && <p>Loading videos...</p>}
//           {error && <p style={{ color: 'red' }}>{error}</p>}

//           <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
//             {videos.map((v) => (
//               <VideoCard key={v._id || v.id} video={v} />
//             ))}
//             {!loading && videos.length === 0 && <p>No videos found.</p>}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from 'react';
import VideoCard from '../components/video/VideoCard';
import Sidebar from '../components/common/Sidebar';
import videoService from '../services/videoService';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await videoService.getAllVideos();

      const videoList = Array.isArray(res?.data)
        ? res.data
        : [];

      setVideos(videoList);
      setError('');
    } catch (err) {
      setError(err.message || 'Error loading videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 20 }}>
        <h2>Trending</h2>

        {loading && <p>Loading videos...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && videos.length === 0 && <p>No videos found.</p>}

        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}
        >
          {Array.isArray(videos) &&
            videos.map((v) => (
              <VideoCard key={v._id || v.id} video={v} />
            ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
