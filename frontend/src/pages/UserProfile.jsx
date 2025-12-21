import React from 'react';
import Sidebar from '../components/common/Sidebar';
import UserProfileComponent from '../components/user/UserProfile';

const UserProfile = () => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 20 }}>
          <UserProfileComponent />
        </main>
      </div>
    </div>
  );
};

export default UserProfile;