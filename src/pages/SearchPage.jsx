import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { app, database, ref, onValue } from '../firebase';
import SearchResultCard from '../components/SearchResultCard';
import Header from '../components/Header';

const SearchPage = () => {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const recipesRef = ref(database, 'recipes');
    onValue(recipesRef, (snapshot) => {
      const recipeList = [];
      snapshot.forEach((childSnapshot) => {
        const recipe = childSnapshot.val();
        recipe.id = childSnapshot.key;
        if (recipe.title.toLowerCase().includes(query.toLowerCase())) {
          recipeList.push(recipe);
        }
      });
      setSearchResults(recipeList);
    });
  }, [query]);

  return (
    <>
    <Header/>
    <div>
        <div className="search-results">
            {searchResults.map((recipe, index) => (
                <SearchResultCard key={index} recipe={recipe} />
            ))}
        </div>
    </div>
    </>
  );
};

export default SearchPage;
