
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsY1GovncQVNHsawiKi6nnKMWySPT6cXU",
  authDomain: "scone-65e0c.firebaseapp.com",
  databaseURL: "https://scone-65e0c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "scone-65e0c",
  storageBucket: "scone-65e0c.appspot.com",
  messagingSenderId: "685258638901",
  appId: "1:685258638901:web:8d560d0bb8f9d52d5f937c"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, database, ref, onValue };


