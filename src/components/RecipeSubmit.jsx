import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../App.scss';
import { useState } from 'react';
import { getDatabase, push, ref, update } from 'firebase/database';
import { getStorage, ref as firebaseStorageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { ref as firebaseRef, get } from 'firebase/database';
import { app } from '../firebase';
import ImageUpload from './ImageUpload';
import Header from './Header';

const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth();


const RecipeSubmit = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const user = auth.currentUser; 
    
    let userAvatar = '';
    let username = '';
  
    if (user) {
      const userRef = firebaseRef(database, 'users/' + user.uid);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        userAvatar = snapshot.val().avatar;
        username = snapshot.val().username;
      }
    }
    
    const newRecipeData = {
      title,
      description,
      instructions,
      ingredients,
      avatar: userAvatar, 
      username
    };
    
    const newRecipeRef = push(ref(database, 'recipes'), newRecipeData);
    
    if (image) {
      const newStorageRef = firebaseStorageRef(storage, `images/${newRecipeRef.key}`);
      await uploadBytes(newStorageRef, image);
      const imageUrl = await getDownloadURL(newStorageRef);
      await update(ref(database, `recipes/${newRecipeRef.key}`), { image: imageUrl });
    }
    
    setTitle('');
    setDescription('');
    setIngredients('');
    setInstructions('');
  };
  
  

  const onFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
  <>
      <Header/>
    <div className='recipe__submission__form'>
      <form onSubmit={handleSubmit}>
        <div className='card__title'>
          <label htmlFor='title'>Title</label>
          <input type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='card__description'>
          <label htmlFor='description'>Description</label>
          <ReactQuill theme="snow" value={description} onChange={setDescription}  />
        </div>
        <div className='card__ingredients'>
          <label htmlFor='ingredients'>Ingredients</label>
          <ReactQuill theme="snow" value={ingredients} onChange={setIngredients}  />
        </div>
        <div className='card__instructions'>
          <label htmlFor='instructions'>Instructions</label>
          <ReactQuill theme="snow" value={instructions} onChange={setInstructions}  />
        </div>
        <ImageUpload image={image} onFileChange={onFileChange} />
        <button type='submit'>Submit</button>
      </form>
    </div>
    </>
  );
};

export default RecipeSubmit;
