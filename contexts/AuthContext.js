'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

/**
 * APP_CONFIG - Critical configuration for multi-app template architecture
 * 
 * This configuration allows multiple apps to share the same Firebase project
 * while keeping their data completely separate through collection prefixing.
 * 
 * WHY THIS MATTERS:
 * - Same Firebase project = shared authentication, billing, and management
 * - Different collection prefixes = isolated data per app
 * - Users can login to multiple apps with same email, but data stays separate
 * 
 * EXAMPLE USAGE:
 * - Calendar app: collectionPrefix: 'calendar' → users stored in 'calendar_users'
 * - Todo app: collectionPrefix: 'todo' → users stored in 'todo_users'  
 * - Sports app: collectionPrefix: 'sports' → users stored in 'sports_users'
 * 
 * TEMPLATE WORKFLOW:
 * 1. Clone this template for new app
 * 2. Change collectionPrefix to your app name
 * 3. Deploy - your app uses same Firebase project but separate data
 * 
 * COST BENEFITS:
 * - One Firebase project for all your apps
 * - Shared free tier limits across apps  
 * - Centralized billing and management
 * - Easy to add new apps without new Firebase setup
 */
const APP_CONFIG = {
  collectionPrefix: 'myapp', // 🎯 CHANGE THIS FOR EACH NEW APP
  collections: {
    users: 'myapp_users', // Will become: calendar_users, todo_users, etc.
    // Add more collections as your app grows:
    // posts: 'myapp_posts',
    // data: 'myapp_data',
  }
};

/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 * Handles Firebase Auth integration and user document management
 */
const AuthContext = createContext();

/**
 * Custom hook to access authentication context
 * Throws error if used outside of AuthProvider to prevent bugs
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Manages authentication state, user data, and provides auth methods
 * Wraps the entire app to provide authentication context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase Auth user object
  const [loading, setLoading] = useState(true); // Loading state for auth check

  /**
   * Set up Firebase Auth state listener on component mount
   * Automatically updates user state when authentication changes
   * Cleans up listener on component unmount
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
      setUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup function
  }, []);

  /**
   * Create or update user document in Firestore
   * This is separate from Firebase Auth - it stores additional user data
   * 
   * @param {Object} user - Firebase Auth user object
   * @param {string} username - Display username for the user
   * @param {Object} additionalData - Any extra fields to store with user
   * @returns {Object} User document data
   * 
   * IMPORTANT: Uses APP_CONFIG.collections.users to store in app-specific collection
   * Example: If collectionPrefix is 'todo', stores in 'todo_users' collection
   */
  const createUserDocument = async (user, username, additionalData = {}) => {
    if (!user) return;
    
    try {
      // Create reference to user document using app-specific collection
      const userRef = doc(db, APP_CONFIG.collections.users, user.uid);
      const userSnapshot = await getDoc(userRef);
      
      if (!userSnapshot.exists()) {
        // Create new user document with default structure
        const now = new Date().toISOString();
        const userData = {
          userId: user.uid,
          email: user.email,
          username: username,
          createdAt: now,
          updatedAt: now,
          isActive: true,
          profilePicture: user.photoURL || null,
          preferences: {
            theme: 'system', // Default theme preference
            defaultTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            notifications: true,
            // Add app-specific preferences here:
            // defaultView: 'list',
            // sortBy: 'date',
          },
          // Spread additional data for app-specific fields
          ...additionalData
        };
        
        await setDoc(userRef, userData);
        console.log('User document created:', userData);
        return userData;
      } else {
        // User document exists, just update the last login timestamp
        const now = new Date().toISOString();
        await updateDoc(userRef, { updatedAt: now });
        console.log('User document exists, updated timestamp');
        return userSnapshot.data();
      }
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  };

  /**
   * Login function using Firebase Auth
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise} Firebase Auth result
   */
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Signup function - creates Firebase Auth user and Firestore document
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} username - Display username
   * @param {Object} additionalData - App-specific user data
   * @returns {Promise} Firebase Auth result
   */
  const signup = async (email, password, username, additionalData = {}) => {
    try {
      // Step 1: Create Firebase Auth user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Step 2: Create user document in app-specific collection
      await createUserDocument(result.user, username, additionalData);
      console.log('User profile created successfully');
      
      return result;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  /**
   * Logout function using Firebase Auth
   * @returns {Promise} Firebase Auth signOut result
   */
  const logout = async () => {
    return signOut(auth);
  };

  /**
 * Google Sign-In function
 * Uses Firebase's Google Auth Provider with popup flow
 * Automatically creates user document if first-time signup
 */
const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if this is a new user and create document if needed
    if (result.user) {
      await createUserDocument(result.user, result.user.displayName || 'User');
    }
    
    return result;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

  /**
   * Context value object containing all auth state and methods
   * Available to any component that uses useAuth() hook
   */
  const value = {
    user, // Current authenticated user (or null)
    login, // Login function
    signup, // Signup function  
    logout, // Logout function
    loading, // Loading state boolean
    createUserDocument, // Helper function for creating user docs
    signInWithGoogle, // Google sign-in function
    APP_CONFIG, // Export config so other components can use collection names
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};