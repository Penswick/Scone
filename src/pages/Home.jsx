import React from 'react';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import '../App.scss';


const Home = () => {
  return (
    <div>
      <Header />
        <div className="recipe-card-container">
          <RecipeCard />
        </div>
    </div>
  );
};

export default Home;
