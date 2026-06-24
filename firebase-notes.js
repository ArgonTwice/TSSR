import { db } from './firebase-config.js';
import {
  doc, getDoc, setDoc, onSnapshot, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';

const FirebaseNotes = {

  saveMemberData: async (moduleId, coursId, pseudo, text, files) => {
    const docId = moduleId + '-' + coursId;
    const totalSize = JSON.stringify({ text, files }).length;

    if (totalSize > 950000) {
      return {
        success: false,
        error: 'Donnees trop volumineuses (' + Math.round(totalSize / 1024) +
               ' Ko). Limite Firestore : ~950 Ko par membre/cours. ' +
               'Retirez un fichier ou reduisez le texte.'
      };
    }

    try {
      await setDoc(doc(db, 'notes', docId), {
        moduleId, coursId,
        members: {
          [pseudo]: {
            text: text || '',
            files: files || [],
            updatedAt: new Date().toISOString(),
          },
        },
      }, { merge: true });
      return { success: true };
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      return { success: false, error: err.message };
    }
  },

  listenToAllMembers: (moduleId, coursId, callback) => {
    const docId = moduleId + '-' + coursId;
    return onSnapshot(doc(db, 'notes', docId), (snap) => {
      callback((snap.data() || {}).members || {});
    }, (err) => console.error('Erreur écoute:', err));
  },

  getAllMembers: async (moduleId, coursId) => {
    const docId = moduleId + '-' + coursId;
    const snap = await getDoc(doc(db, 'notes', docId));
    return (snap.data() || {}).members || {};
  },

  saveSummary: async (moduleId, coursId, summary) => {
    const docId = moduleId + '-' + coursId;
    try {
      await setDoc(doc(db, 'notes', docId), {
        summaryAuto: summary,
        summaryAutoUpdatedAt: serverTimestamp(),
      }, { merge: true });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  listenToSummary: (moduleId, coursId, callback) => {
    const docId = moduleId + '-' + coursId;
    return onSnapshot(doc(db, 'notes', docId), (snap) => {
      const data = snap.data() || {};
      callback({
        summary: data.summaryAuto || '',
        updatedAt: data.summaryAutoUpdatedAt?.toDate?.() || null,
      });
    }, (err) => console.error('Erreur écoute résumé:', err));
  },

};

export { FirebaseNotes };
