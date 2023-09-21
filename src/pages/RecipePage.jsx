import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { app, database, ref, onValue } from '../firebase';
import parse from 'html-react-parser';
import '../App.scss';
import Header from '../components/Header';
import Ratings from 'react-ratings-declarative';

const RecipePage = () => {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();
  const [selectedRating, setSelectedRating] = useState(0);  
  const reviewSectionRef = useRef(null)
  const scrollToReviewSection = () => {  
    reviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const recipeRef = ref(database, `recipes/${id}`);
    onValue(recipeRef, (snapshot) => {
      setRecipe(snapshot.val());
    });
  }, [id]);

  const changeRating = (newRating) => {
    setSelectedRating(newRating);
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className='recipe__page-container'>
        <article className="recipe__page-top-content">
            <div className="recipe__average-rating" onClick={scrollToReviewSection}>  
              <p>Average Rating: ★★★★☆ (Placeholder)</p>
            </div>
          <figure className="recipe__page-image">
            <img src={recipe.image} alt={recipe.title} />
          </figure>
          <section className="recipe__page-content">
            <header className="recipe__page-title">
              <h2>{recipe.title}</h2>
            </header>
            <div className="recipe__page-description">
              {parse(recipe.description)}
            </div>
          </section>
        </article>
        <article className="recipe__page-bottom-content">
          <section className="recipe__page-ingredients">
            <h1>INGREDIENTS</h1>
            {parse(recipe.ingredients)}
          </section>
          <section className="recipe__page-instructions">
            <h1>INSTRUCTIONS</h1>
            {parse(recipe.instructions)}
          </section>
          <section className="recipe__page-reviews" ref={reviewSectionRef}>
            <h1>REVIEWS</h1>
            <div className="recipe__review-form">
              <h3>Submit Your Review:</h3>
              <form>
                <label>
                  Rating:
                  <Ratings
                    rating={selectedRating}
                    widgetRatedColors="gold"
                    widgetHoverColors="gold"
                    widgetDimensions="20px"
                    widgetSpacings="5px"
                    changeRating={changeRating}
                  >
                    <Ratings.Widget className="custom-star"/>
                    <Ratings.Widget className="custom-star"/>
                    <Ratings.Widget className="custom-star"/>
                    <Ratings.Widget className="custom-star"/>
                    <Ratings.Widget className="custom-star"/>
                  </Ratings>
                </label>
                <textarea placeholder="Write your review here..."></textarea>
                <button type="submit" disabled={selectedRating === 0}>Submit Review</button>
              </form>
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default RecipePage;
