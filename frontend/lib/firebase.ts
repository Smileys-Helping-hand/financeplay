import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA6Avdbq16wms04xOw9pmykjXbe9-YSSI8",
  authDomain: "cvgen21.firebaseapp.com",
  projectId: "cvgen21",
  storageBucket: "cvgen21.firebasestorage.app",
  messagingSenderId: "185730305114",
  appId: "1:185730305114:web:b11b114533ea424609dc63",
  measurementId: "G-KXSJ2KWW3W"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export default app;
