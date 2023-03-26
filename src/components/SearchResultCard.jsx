import React from 'react';
import { Link } from 'react-router-dom';
import '../App.scss';

const SearchResultCard = ({ recipe }) => {
  return (
    <div className='search__result-card-container'>
      <Link to={`/recipe/${recipe.id}`}>
        <div className='search__result-card'>
          <div className="search__result-card-title">
            <h2>{recipe.title}</h2>
          </div>
          <div className="search__result-card-description">
            <p>{recipe.description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResultCard;
