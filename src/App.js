import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RecipePage from './pages/RecipePage';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Fave from './pages/Fave';
import { FavoritesProvider } from './components/FavoritesContext';

function App() {
  return (
    <Router>
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fave" element={<Fave />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </FavoritesProvider>
    </Router>
  );
}

export default App;
