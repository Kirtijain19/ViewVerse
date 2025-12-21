import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import VideoDetail from './pages/VideoDetail';
import Playlist from './pages/Playlist';
import UserProfile from './pages/UserProfile';
import Upload from './pages/Upload';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserProvider } from './context/UserContext';

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <UserProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* video / playlist / profile routes */}
              <Route path="/video/:id" element={<VideoDetail />} />
              <Route path="/playlist/:id" element={<Playlist />} />
              <Route path="/profile/:userId" element={<UserProfile />} />

              {/* upload & common sidebar targets (map to existing pages for now) */}
              <Route path="/upload" element={<Upload />} />
              <Route path="/shorts" element={<Home />} />
              <Route path="/subscriptions" element={<Home />} />
              <Route path="/playlists" element={<Home />} />
              <Route path="/history" element={<Home />} />
              <Route path="/likes" element={<Home />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </Router>
        </UserProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;