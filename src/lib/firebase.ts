import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with settings and the database ID from the config
let db: Firestore;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
    localCache: {
      kind: 'memory' 
    }
  }, (firebaseConfig as any).firestoreDatabaseId);
} catch (e) {
  // If already initialized, it might throw
  db = initializeFirestore(app, {});
}

export { db };
export const auth = getAuth(app);
