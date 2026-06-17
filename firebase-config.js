import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            'AIzaSyBVj0oD_7MI0yE9DtiXQ77srwRHfbkmb2Y',
  authDomain:        'tssr-pwa.firebaseapp.com',
  projectId:         'tssr-pwa',
  storageBucket:     'tssr-pwa.firebasestorage.app',
  messagingSenderId: '913533854406',
  appId:             '1:913533854406:web:1644b8fea969fcd3f8edc7',
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

export { db };
