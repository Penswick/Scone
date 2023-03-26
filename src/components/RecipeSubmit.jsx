import { useState } from 'react';
import { getDatabase, push, ref, update } from 'firebase/database';
import { getStorage, ref as firebaseStorageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import '../App.scss';
import ImageUpload from './ImageUpload';

const database = getDatabase(app);
const storage = getStorage(app);

const RecipeSubmit = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecipeRef = push(ref(database, 'recipes'), { title, description, instructions, ingredients });
  
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
    <div className='recipe__submission__form'>
      <form onSubmit={handleSubmit}>
        <div className='card__title'>
          <label htmlFor='title'>Title</label>
          <input type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='card__description'>
          <label htmlFor='description'>Description</label>
          <textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className='card__ingredients'>
          <label htmlFor='ingredients'>Ingredients</label>
          <textarea id='ingredients' value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        </div>
        <div className='card__instructions'>
          <label htmlFor='instructions'>Instructions</label>
          <textarea id='instructions' value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </div>
        <ImageUpload image={image} onFileChange={onFileChange} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default RecipeSubmit;
