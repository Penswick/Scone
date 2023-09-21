import { createContext, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null); 

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites, user, setUser }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
