import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api'; // ✅ correct relative path from /src/pages to /src/utils

import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${user._id}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [user._id]);

  return (
    <div>
      <h2>Welcome, {profile?.username}</h2>
      {/* render user's posts or profile info here */}
    </div>
  );
};

export default Profile;
