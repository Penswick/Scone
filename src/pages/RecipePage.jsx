import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { app, database, ref, onValue } from '../firebase';
import '../App.scss';
import Header from '../components/Header';

const RecipePage = () => {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const recipeRef = ref(database, `recipes/${id}`);
    onValue(recipeRef, (snapshot) => {
      setRecipe(snapshot.val());
    });
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }
  
    return (
      <>
      <Header/>
      <div>
        <div className='recipe__page-container'>
          <div className="recipe__page-top-content">
            <div className="recipe__page-image">
              <img src={recipe.image} alt={recipe.title} />
            </div>
            <div className="recipe__page-content">
              <div className="recipe__page-title">
                <h2>{recipe.title}</h2>
              </div>
              <div className="recipe__page-description">
                <p>{recipe.description}</p>
              </div>
            </div>
          </div>
          <div className="recipe__page-bottom-content">
            <div className="recipe__page-ingredients">
              <h1>INGREDIENTS</h1>
              <p>{recipe.ingredients}</p>
            </div>
            <div className="recipe__page-instructions">
              <h1>INSTRUCTIONS</h1>
              <p>{recipe.instructions}</p>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  };
  
  export default RecipePage;