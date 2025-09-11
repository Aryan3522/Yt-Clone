import { openDB } from 'idb';

let dbPromise;

if (typeof window !== 'undefined' && 'indexedDB' in window) {
  dbPromise = openDB('ytc-videos', 1, {
    upgrade(db) {
      db.createObjectStore('videos', { keyPath: 'id' }); // id, title, blob
    },
  });
}

export const saveVideo = async (videoObj) => {
  if (!dbPromise) return; // no db in non-browser env
  const db = await dbPromise;
  await db.put('videos', videoObj);
};

export const getAllVideos = async () => {
  if (!dbPromise) return [];
  const db = await dbPromise;
  return db.getAll('videos');
};

export const getVideo = async (id) => {
  if (!dbPromise) return null;
  const db = await dbPromise;
  return db.get('videos', id);
};
