import React, { useState } from 'react';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import '../App.scss';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header />
      <div className="home__recipe-container">
        <RecipeCard
          currentPage={currentPage}
          recipesPerPage={recipesPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Home;
