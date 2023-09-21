import '../App.scss';
import React, { useState, useEffect } from 'react';
import logo from '../images/Logo.png'; 
import { useNavigate, Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { AiOutlineUser } from 'react-icons/ai';
import { ref as firebaseRef, child, get } from 'firebase/database';
import { database } from '../firebase.js';

const Header = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchValue}`);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <header className="header">
      <div className="header__left">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="header__middle">
        <form className="header__search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search for recipes"
            className="header__search-input"
            value={searchValue}
            onChange={handleInputChange}
          />
          <button type="submit" disabled={!searchValue.trim()}>
            Search
          </button>
        </form>
      </div>
      <div className="header__right">
        {user ? (
          <>
            <div className="dropdown">
              <button className="dropdown__toggle">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="User Avatar" className="user__avatar" /> 
                ) : (
                  <AiOutlineUser className="user__icon" size={30} /> 
                )}
              </button>
              <div className="dropdown__menu">
                <button className="dropdown__item">{username}</button>
                <Link to="/fave">
                  <button className="dropdown__item">Favorites</button>
                </Link>
                <Link to="/recipe-submit">
                  <button className="dropdown__item">Submit a Recipe</button>
                </Link>
                <button className="dropdown__item" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login">
            <button className="header__login-button">Log in</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
