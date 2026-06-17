import { db } from './firebase-config.js';
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion,
  onSnapshot, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';

const FirebaseNotes = {

  savePersonalNote: async (moduleId, coursId, content) => {
    const docId  = moduleId + '-' + coursId;
    const pseudo = localStorage.getItem('tssr_pseudo') || 'Anonyme';
    try {
      await setDoc(doc(db, 'notes', docId),
        { moduleId, coursId, pseudo, content, updatedAt: serverTimestamp() },
        { merge: true });
      return { success: true };
    } catch (err) {
      console.error('Erreur sauvegarde notes:', err);
      return { success: false, error: err.message };
    }
  },

  listenToSharedNotes: (moduleId, coursId, callback) => {
    const docRef = doc(db, 'notes', moduleId + '-' + coursId);
    return onSnapshot(docRef, snap => {
      const d = snap.data() || {};
      callback({
        content:   d.content   || '',
        pseudo:    d.pseudo    || 'Anonyme',
        updatedAt: d.updatedAt?.toDate?.() || null,
      });
    }, err => console.error('Erreur écoute notes:', err));
  },

  trackFileUpload: async (moduleId, coursId, file, content) => {
    const docId  = moduleId + '-' + coursId;
    const pseudo = localStorage.getItem('tssr_pseudo') || 'Anonyme';
    const entry  = {
      userId:     pseudo,
      type:       'file',
      content:    content.substring(0, 3000),
      filename:   file.name,
      fileSize:   file.size,
      uploadedAt: new Date().toISOString(),
    };
    try {
      await updateDoc(doc(db, 'course-content', docId),
        { contentSources: arrayUnion(entry), lastUpdatedAt: serverTimestamp() });
    } catch (_) {
      await setDoc(doc(db, 'course-content', docId),
        { moduleId, coursId, contentSources: [entry], createdAt: serverTimestamp() });
    }
    return { success: true };
  },

  trackTextNotes: async (moduleId, coursId, content) => {
    if (!content.trim()) return { success: true };
    const docId  = moduleId + '-' + coursId;
    const pseudo = localStorage.getItem('tssr_pseudo') || 'Anonyme';
    const entry  = {
      userId:     pseudo,
      type:       'text',
      content:    content.substring(0, 2000),
      uploadedAt: new Date().toISOString(),
    };
    try {
      await updateDoc(doc(db, 'course-content', docId),
        { contentSources: arrayUnion(entry), lastUpdatedAt: serverTimestamp() });
    } catch (_) {
      await setDoc(doc(db, 'course-content', docId),
        { moduleId, coursId, contentSources: [entry], createdAt: serverTimestamp() });
    }
    return { success: true };
  },

  listenToAutoSummary: (moduleId, coursId, callback) => {
    const docRef = doc(db, 'course-content', moduleId + '-' + coursId);
    return onSnapshot(docRef, snap => {
      const d = snap.data() || {};
      callback({
        summary:     d.summaryAuto || '',
        updatedAt:   d.summaryAutoUpdatedAt?.toDate?.() || null,
        sourceCount: (d.contentSources || []).length,
      });
    }, err => console.error('Erreur écoute résumé:', err));
  },

  getAggregatedContent: async (moduleId, coursId) => {
    try {
      const snap = await getDoc(doc(db, 'course-content', moduleId + '-' + coursId));
      return (snap.data() || {}).contentSources || [];
    } catch (err) {
      console.error('Erreur récupération contenu:', err);
      return [];
    }
  },

  saveSummary: async (moduleId, coursId, summary) => {
    try {
      await updateDoc(doc(db, 'course-content', moduleId + '-' + coursId), {
        summaryAuto:           summary,
        summaryAutoUpdatedAt:  serverTimestamp(),
      });
      return { success: true };
    } catch (err) {
      console.error('Erreur sauvegarde résumé:', err);
      return { success: false, error: err.message };
    }
  },

};

export { FirebaseNotes };
