import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import FavoritesContext from '../components/FavoritesContext'; // Import FavoritesContext

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(true);
  const { setUser } = useContext(FavoritesContext); 

  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const auth = getAuth();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Registered user:', user);
          setUser(user); 
          navigate('/');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(`Registration error: ${errorCode}: ${errorMessage}`);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Logged in user:', user);
          setUser(user); 
          navigate('/');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(`Login error: ${errorCode}: ${errorMessage}`);
        });
    }
  };

  const toggleForm = () => setIsRegister(!isRegister);

  return (
    <div className='register__form-container'>
      <form className='register__form' onSubmit={handleFormSubmit}>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <div>
        {isRegister ? 'Already have an account? ' : 'Don\'t have an account? '}
        <button onClick={toggleForm}>{isRegister ? 'Log in' : 'Register'}</button>
      </div>
    </div>
  );
};

export default Login;
