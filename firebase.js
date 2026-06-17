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
  apiKey:            'AIzaSyBVj0oD_7MI0yE9DtiXQ77srwRHfbkmb2Y',
  authDomain:        'tssr-pwa.firebaseapp.com',
  projectId:         'tssr-pwa',
  storageBucket:     'tssr-pwa.firebasestorage.app',
  messagingSenderId: '913533854406',
  appId:             '1:913533854406:web:1644b8fea969fcd3f8edc7',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { doc, collection, getDoc, setDoc, updateDoc, onSnapshot, arrayUnion, serverTimestamp };
