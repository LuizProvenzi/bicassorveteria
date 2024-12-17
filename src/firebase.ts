import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyACaxu4FUSNOPnL_GwzW9O9gETUFLDXiKo',
  authDomain: 'bicassorveteria.firebaseapp.com',
  projectId: 'bicassorveteria',
  storageBucket: 'bicassorveteria.firebasestorage.app',
  messagingSenderId: '215625565914',
  appId: '1:215625565914:web:52768ffd6adcccaa2747e3',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
