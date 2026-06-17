import { db } from './firebase-config.js';
import {
  doc, getDoc, setDoc,
  onSnapshot, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';

const FirebaseNotes = {

  saveMemberShared: async (moduleId, coursId, pseudo, content) => {
    const docId = moduleId + '-' + coursId;
    try {
      await setDoc(doc(db, 'notes', docId), {
        moduleId,
        coursId,
        members: {
          [pseudo]: {
            shared: content,
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
    const docRef = doc(db, 'notes', moduleId + '-' + coursId);
    return onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data() || {};
      callback(data.members || {});
    }, (err) => console.error('Erreur écoute membres:', err));
  },

  listenToSummary: (moduleId, coursId, callback) => {
    const docRef = doc(db, 'notes', moduleId + '-' + coursId);
    return onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data() || {};
      callback({
        summary: data.summaryAuto || '',
        updatedAt: data.summaryAutoUpdatedAt?.toDate?.() || null,
      });
    }, (err) => console.error('Erreur écoute résumé:', err));
  },

  getAllSharedContent: async (moduleId, coursId) => {
    const docId = moduleId + '-' + coursId;
    try {
      const snapshot = await getDoc(doc(db, 'notes', docId));
      const data = snapshot.data() || {};
      return data.members || {};
    } catch (err) {
      console.error('Erreur récupération:', err);
      return {};
    }
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
      console.error('Erreur sauvegarde résumé:', err);
      return { success: false, error: err.message };
    }
  },

};

export { FirebaseNotes };
