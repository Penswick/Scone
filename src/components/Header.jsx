import '../App.scss';
import React, { useState } from 'react';
import logo from '../images/Logo.png'; 
import { useNavigate, Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { AiOutlineUser } from 'react-icons/ai';

const Header = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const auth = getAuth();
  const [user] = useAuthState(auth);

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
              <button className="dropdown-toggle">
                <AiOutlineUser size={30} />
              </button>
              <div className="dropdown-menu">
                <Link to="/fave">
                  <button className="dropdown-item">Favorites</button>
                </Link>
                <button className="dropdown-item" onClick={handleLogout}>
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
