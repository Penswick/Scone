import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import FavoritesContext from '../components/FavoritesContext';
import '../App.scss';
import Header from '../components/Header';

const Fave = () => {
  const { favorites } = useContext(FavoritesContext);

  return (
    <>
      <Header />
      <div className="favorites-container">
        {favorites.map((favorite, index) => (
          <Link to={`/recipe/${favorite.id}`} key={index}>
            <div className="recipe__card-fave">
              <h2>{favorite.title}</h2>
              <img src={favorite.image} alt={favorite.title} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Fave;
