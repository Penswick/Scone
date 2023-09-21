import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref as firebaseRef, child, get, set } from 'firebase/database';
import { getStorage, ref as firebaseStorageRef, uploadBytes, getDownloadURL } from 'firebase/storage';  
import { database } from '../firebase.js';
import FavoritesContext from '../components/FavoritesContext'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(null); 
  const [isRegister, setIsRegister] = useState(true);
  const { setUser } = useContext(FavoritesContext); 

  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1048576) {  
      setAvatar(file);
    } else {
      console.error('File is too large.');
      setAvatar(null);
    }
  };

  const auth = getAuth();

  const checkUsernameUnique = async (username) => {
    const usernameRef = child(firebaseRef(database), 'users');
    const snapshot = await get(usernameRef);
    const users = snapshot.val();
    for(let id in users){
      if(users[id].username === username) return false; 
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      checkUsernameUnique(username).then(isUnique => {
        if (!isUnique) {
          console.error('Username is already taken');
          return;
        }
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            const user = userCredential.user;
            let avatarURL = null;

            if (avatar) {
              const avatarStorageRef = firebaseStorageRef(getStorage(), `avatars/${user.uid}`);
              await uploadBytes(avatarStorageRef, avatar);
              avatarURL = await getDownloadURL(avatarStorageRef);
            }

            const userRef = firebaseRef(database, 'users/' + user.uid); 
            set(userRef, {
              username: username,
              email: email,
              avatar: avatarURL
            });

            setUser(user); 
            navigate('/');
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Registration error: ${errorCode}: ${errorMessage}`);
          });
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
        {isRegister && (
          <>
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" value={username} onChange={handleUsernameChange} />
            </div>
            <div>
              <label htmlFor="avatar">Avatar (Max 1 MB):</label>
              <input type="file" id="avatar" accept="image/*" onChange={handleAvatarChange} />
            </div>
          </>
        )}
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
