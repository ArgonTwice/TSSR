// firebase.js — remplir avec ta config Firebase
// console.firebase.google.com > Paramètres du projet > Vos applications > </> > firebaseConfig

import { initializeApp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore, doc, collection,
  getDoc, setDoc, updateDoc,
  onSnapshot, arrayUnion, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            'REMPLACER',
  authDomain:        'REMPLACER.firebaseapp.com',
  projectId:         'REMPLACER',
  storageBucket:     'REMPLACER.appspot.com',
  messagingSenderId: 'REMPLACER',
  appId:             'REMPLACER',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { doc, collection, getDoc, setDoc, updateDoc, onSnapshot, arrayUnion, serverTimestamp };
