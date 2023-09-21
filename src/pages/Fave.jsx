import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import FavoritesContext from '../components/FavoritesContext';
import '../App.scss';
import Header from '../components/Header';
import { getDatabase, ref, remove } from 'firebase/database';  // <-- Add this line
import { AiOutlineHeart } from 'react-icons/ai'; // <-- Add this line
import { getAuth } from 'firebase/auth';  // <-- Add this line
import { useAuthState } from 'react-firebase-hooks/auth';  // <-- Add this line


const Fave = () => {
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const auth = getAuth();  // <-- Add this line
  const [user] = useAuthState(auth);  // <-- Add this line
  
  const handleFaveClick = async (favorite) => {  // <-- Add this function
    if (!user) {
      alert('Please login to remove a favorite.');
      return;
    }
    const isFavorited = favorites.some((fav) => fav.id === favorite.id);
    const userId = user.uid;
    const db = getDatabase();
    const favRef = ref(db, `users/${userId}/favorites/${favorite.id}`);
    if (isFavorited) {
      await remove(favRef);
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favorite.id));
    }
  };

  return (
    <>
      <Header />
      <div className="favorites-container">
        {favorites.map((favorite, index) => (
          <div key={index}>
            <Link to={`/recipe/${favorite.id}`}>
              <div className="recipe__card-fave">
                <h2>{favorite.title}</h2>
                <img src={favorite.image} alt={favorite.title} />
              </div>
            </Link>
            <button onClick={() => handleFaveClick(favorite)}>  {/* Add this button */}
              <AiOutlineHeart size={30} color={favorites.some((fav) => fav.id === favorite.id) ? 'red' : 'gray'} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Fave;
