import React, { useState, useEffect } from 'react';
import '../App.scss';
import { ref as firebaseRef, child, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { database } from '../firebase.js';
import { AiOutlineUser } from 'react-icons/ai';

function UserAcc() {
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null); 
  const auth = getAuth();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = child(firebaseRef(database), 'users/' + user.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUsername(snapshot.val().username);
          setAvatarUrl(snapshot.val().avatar); 
        }
      };
      
      fetchUserData();
    } else {
      setUsername('');
      setAvatarUrl(null); 
    }
  }, [user]);

  return (
    <div className="user-acc-container">
      <div className="user-acc-left">
        <h2 className="username">{username}</h2>
        {avatarUrl ? (
          <img src={avatarUrl} alt="User Avatar" className="user__avatar" /> 
        ) : (
          <AiOutlineUser className="user__icon" size={30} /> 
        )}
        <ul className="account-options">
          <li>Change Avatar</li>
          <li>Change Username</li>
          <li>Change Email</li>
          <li>Change Password</li>
          <li>Delete Account</li>
        </ul>
      </div>
      <div className="user-acc-middle">
        <p>Placeholder text for content display.</p>
      </div>
      <div className="user-acc-right">
        <h3>My Submitted Recipes</h3>
        <p>Placeholder for submitted recipes list.</p>
        <h3>My Reviews</h3>
        <p>Placeholder for user reviews list.</p>
      </div>
    </div>
  );
}

export default UserAcc;
