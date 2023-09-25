import React, { useState, useEffect, useContext } from 'react';
import '../App.scss';
import { getDatabase, ref, onValue, set, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import FavoritesContext from '../components/FavoritesContext';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsShare } from 'react-icons/bs';


const RecipeCard = ({ currentPage, recipesPerPage, onPageChange }) => {
  const auth = getAuth();
  const [recipes, setRecipes] = useState([]);
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const [user] = useAuthState(auth);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [currentRecipeUrl, setCurrentRecipeUrl] = useState('');
  const [currentRecipeTitle, setCurrentRecipeTitle] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const recipesRef = ref(db, 'recipes');
    onValue(recipesRef, (snapshot) => {
      const recipeList = [];
      snapshot.forEach((childSnapshot) => {
        const recipe = childSnapshot.val();
        recipe.id = childSnapshot.key;
        recipeList.push(recipe);
      });
      setRecipes(recipeList);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userFavoritesRef = ref(db, `users/${user.uid}/favorites`);
      onValue(userFavoritesRef, (snapshot) => {
        const fetchedFavorites = [];
        snapshot.forEach((childSnapshot) => {
          const favorite = childSnapshot.val();
          favorite.id = childSnapshot.key;
          fetchedFavorites.push(favorite);
        });
        setFavorites(fetchedFavorites);
      });
    } else {
      setFavorites([]);
    }
  }, [user, setFavorites]);

  const handleFaveClick = async (recipe) => {
    if (!user) {
      alert('Please login to favorite a recipe.');
      return;
    }
    const isFavorited = favorites.some((fav) => fav.id === recipe.id);
    const userId = user.uid;
    const db = getDatabase();
    const favRef = ref(db, `users/${userId}/favorites/${recipe.id}`);
    if (isFavorited) {
      await remove(favRef);
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== recipe.id));
    } else {
      await set(favRef, recipe);
      setFavorites((prevFavorites) => [...prevFavorites, recipe]);
    }
  };

  const handleShareClick = (recipe) => {
    const recipeUrl = window.location.origin + `/recipe/${recipe.id}`;
    setCurrentRecipeUrl(recipeUrl);
    setCurrentRecipeTitle(recipe.title); 
    setShowSharePopup(true);
  };
  
  const handleCloseSharePopup = () => {
    setShowSharePopup(false);
  };

  return (
    <div>
      {showSharePopup && (
        <div className="share-popup-overlay" onClick={handleCloseSharePopup}>
          <div className="share-popup" onClick={(e) => e.stopPropagation()}>
            <h2>Share this delicious {currentRecipeTitle} recipe!</h2>
            <input type="text" value={currentRecipeUrl} readOnly />
            <p>Copy the link above and share it with everyone you know.</p>
            <button className="close-popup-btn" onClick={handleCloseSharePopup}>
              Close
            </button>
          </div>
        </div>
      )}
  
      <div className='recipe__card-container'>
      {recipes.slice((currentPage - 1) * recipesPerPage, currentPage * recipesPerPage).map((recipe, index) => ( 
          <div key={index}>
            <div className='recipe__card'>
              <Link to={`/recipe/${recipe.id}`}>
                <div className="recipe__card-image">
                  <img src={recipe.image} alt={recipe.title} />
                </div>
                <div className="recipe__card-title">
                  <h2>{recipe.title}</h2>
                </div>

              </Link>
              <div className="favshare__btns">
                <button onClick={() => handleFaveClick(recipe)}>
                  <AiOutlineHeart size={50} color={favorites.some((fav) => fav.id === recipe.id) ? 'red' : 'gray'} />
                </button>
                <button onClick={() => handleShareClick(recipe)}>
                  <BsShare size={50} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(recipes.length / recipesPerPage) }, (_, i) => (
          <button
            key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => onPageChange(i + 1)}>
            {i + 1}
          </button>
        ))}
    </div>

    </div>
  );
};
  export default RecipeCard;