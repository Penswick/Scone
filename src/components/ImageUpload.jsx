import React from 'react';
import { getStorage, ref as firebaseStorageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, push, ref, update } from 'firebase/database';
import { app } from '../firebase';
import '../App.scss';

const storage = getStorage(app);
const database = getDatabase(app);

const HandleImageUpload = ({ onFileChange }) => (
  <>
    <input type="file" accept="image/*" onChange={onFileChange} />
  </>
);

const ImageUpload = ({ image, onFileChange }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecipeRef = push(ref(database, 'recipes'));
    if (image) {
      const newStorageRef = firebaseStorageRef(storage, `images/${newRecipeRef.key}`);
      await uploadBytes(newStorageRef, image);
      const imageUrl = await getDownloadURL(newStorageRef);
      await update(ref(database, `recipes/${newRecipeRef.key}`), { image: imageUrl });
    }
  };

  return (
    <div className='recipe__submission__form'>
      <form onSubmit={handleSubmit}>
        <div className='card__image'>
          <HandleImageUpload onFileChange={onFileChange} />
        </div>
        {/* <button type="submit">Upload Image</button> */}
      </form>
    </div>
  );
};

export default ImageUpload;
