import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import '../App.scss';
import Header from '../components/Header';
import Ratings from 'react-ratings-declarative';
import { getAuth } from 'firebase/auth';
import { push, ref as firebaseRef, set, get, onValue } from 'firebase/database'; 
import { database } from '../firebase';

const RecipePage = () => {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();
  const [selectedRating, setSelectedRating] = useState(0);  
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [userAvatar, setUserAvatar] = useState(null);
  const reviewSectionRef = useRef(null)
  const auth = getAuth();
  const user = auth.currentUser;
  

  const scrollToReviewSection = () => {  
    reviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeRef = firebaseRef(database, 'recipes/' + id);
      const snapshot = await get(recipeRef);
      if (snapshot.exists()) {
        setRecipe(snapshot.val());
      }
    }

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const reviewsRef = firebaseRef(database, `reviews/${id}`);
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      if (snapshot.exists()) {
        const reviewsArray = [];
        snapshot.forEach(childSnapshot => {
          reviewsArray.push(childSnapshot.val());
        });
        setReviews(reviewsArray);
      } else {
        setReviews([]);
      }
    });

    return () => unsubscribe();  
  }, [id]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userRef = firebaseRef(database, 'users/' + user.uid);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserAvatar(snapshot.val().avatar); 
        }
      };
        
      fetchUserData();
    } else {
      setUserAvatar(null); 
    }
  }, [user]);
  

  const changeRating = (newRating) => {
    setSelectedRating(newRating);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (user) {
      const reviewData = {
        username: user.displayName,
        uid: user.uid,
        avatar: userAvatar,
        rating: selectedRating,
        text: reviewText,
        timestamp: Date.now(),
      };
      const newReviewRef = push(firebaseRef(database, `reviews/${id}`));
      await set(newReviewRef, reviewData);
      setReviewText('');
      setSelectedRating(0);
    } else {
      console.error("User must be logged in to submit a review.");
    }
  };

  const averageRating = reviews.length ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(2) : 0;

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className='recipe__page-container'>
      <article className="recipe__page-top-content">
            <div className="recipe__average-rating" onClick={scrollToReviewSection}>  
              <Ratings
                  rating={parseFloat(averageRating)}
                  widgetRatedColors="gold"
                  widgetHoverColors="gold"
                  widgetDimensions="20px"
                  widgetSpacings="5px">
                  <Ratings.Widget className="custom-star"/>
                  <Ratings.Widget className="custom-star"/>
                  <Ratings.Widget className="custom-star"/>
                  <Ratings.Widget className="custom-star"/>
                  <Ratings.Widget className="custom-star"/>
              </Ratings>
          </div>
          <div className="recipe__submitter-info">
              <img src={recipe.avatar} alt={`${recipe.username}'s avatar`} width="50" height="50" />
              <p>Submitted by: <strong>{recipe.username}</strong></p>
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
              <form onSubmit={handleReviewSubmit}>
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
                <textarea value={reviewText} onChange={handleReviewTextChange} placeholder="Write your review here..."></textarea>
                <button type="submit" disabled={selectedRating === 0 || !reviewText.trim()}>Submit Review</button>
              </form>
            </div>
            <div className="reviews__list">
            {reviews.map((review, index) => (
              <div key={index} className="review__item">
                <img src={review.avatar} alt={review.username + "'s avatar"} width="50" height="50" /> 
                <div className="review__stars">
                  <Ratings
                    rating={review.rating}
                    widgetRatedColors="gold"
                    widgetDimensions="20px"
                    widgetSpacings="5px">
                    <Ratings.Widget widgetRatedColor="gold" />
                    <Ratings.Widget widgetRatedColor="gold" />
                    <Ratings.Widget widgetRatedColor="gold" />
                    <Ratings.Widget widgetRatedColor="gold" />
                    <Ratings.Widget widgetRatedColor="gold" />
                  </Ratings>
                </div>
                <p><strong>{review.username}</strong>: {review.text}</p>
              </div>
            ))}
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default RecipePage;