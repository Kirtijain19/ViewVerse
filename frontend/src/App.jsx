import { Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import Home from "./pages/Home.jsx";
import Watch from "./pages/Watch.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Upload from "./pages/Upload.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Playlists from "./pages/Playlists.jsx";
import PlaylistDetail from "./pages/PlaylistDetail.jsx";
import Liked from "./pages/Liked.jsx";
import NotFound from "./pages/NotFound.jsx";
import RequireAuth from "./components/layout/RequireAuth.jsx";
import Settings from "./pages/Settings.jsx";
import History from "./pages/History.jsx";
import Tweets from "./pages/Tweets.jsx";
import MyTweets from "./pages/MyTweets.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Channel from "./pages/Channel.jsx";
import Search from "./pages/Search.jsx";

const App = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="watch/:videoId" element={<Watch />} />
        <Route path="search" element={<Search />} />
        <Route path="channel/:username" element={<Channel />} />
        <Route
          path="upload"
          element={
            <RequireAuth>
              <Upload />
            </RequireAuth>
          }
        />
        <Route
          path="studio"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="playlists"
          element={
            <RequireAuth>
              <Playlists />
            </RequireAuth>
          }
        />
        <Route
          path="playlists/:playlistId"
          element={
            <RequireAuth>
              <PlaylistDetail />
            </RequireAuth>
          }
        />
        <Route
          path="liked"
          element={
            <RequireAuth>
              <Liked />
            </RequireAuth>
          }
        />
        <Route
          path="history"
          element={
            <RequireAuth>
              <History />
            </RequireAuth>
          }
        />
        <Route
          path="tweets"
          element={
            <RequireAuth>
              <Tweets />
            </RequireAuth>
          }
        />
        <Route
          path="my-tweets"
          element={
            <RequireAuth>
              <MyTweets />
            </RequireAuth>
          }
        />
        <Route
          path="subscriptions"
          element={
            <RequireAuth>
              <Subscriptions />
            </RequireAuth>
          }
        />
        <Route
          path="settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
