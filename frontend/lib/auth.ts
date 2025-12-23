import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';
import { setUserId, clearUserId } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(email: string, password: string, name: string) {
  try {
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Create user in your backend database
    const response = await axios.post(`${API_URL}/data/user/init`, {
      email: firebaseUser.email,
      name,
      firebaseUid: firebaseUser.uid
    });
    
    // Store user ID in localStorage
    setUserId(response.data.userId);
    
    return { user: firebaseUser, userId: response.data.userId };
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address.');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Failed to create account.');
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get user from your backend database
    const response = await axios.post(`${API_URL}/data/user/login`, {
      email: firebaseUser.email,
      firebaseUid: firebaseUser.uid
    });
    
    // Store user ID in localStorage
    setUserId(response.data.user.id);
    
    return { user: firebaseUser, userId: response.data.user.id };
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later.');
    } else if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password.');
    }
    
    // Handle backend errors
    if (error.response?.status === 404) {
      throw new Error('Account not found in database. Please contact support or sign up again.');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Failed to sign in. Please check your connection.');
  }
}

/**
 * Sign out the current user
 */
export async function logOut() {
  try {
    await signOut(auth);
    clearUserId();
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to log out.');
  }
}

/**
 * Get the current Firebase user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Listen to authentication state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
