'use client';
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Data Context for managing application-specific data and state
 * 
 * PURPOSE:
 * - Centralized data management for app-specific content
 * - Placeholder structure for future data logic
 * - Consistent pattern matching mobile template
 * 
 * TEMPLATE APPROACH:
 * - Starts minimal with test data
 * - Easy to expand with real data management
 * - Maintains separation between auth and app data
 * 
 * WHEN TO EXPAND:
 * - Add state for app-specific data (posts, tasks, etc.)
 * - Include API calls or Firebase queries
 * - Implement caching and data synchronization
 */
const DataContext = createContext();

/**
 * Custom hook to access data context
 * 
 * @returns {Object} Data context containing app state and methods
 * @throws {Error} If used outside of DataProvider
 * 
 * USAGE:
 * const { testData, loading, user } = useData();
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

/**
 * Data Provider Component
 * 
 * Manages application-specific data state and provides it to child components.
 * Currently minimal but ready for expansion as app requirements grow.
 * 
 * ARCHITECTURE:
 * - Accesses user from AuthContext (no data duplication)
 * - Provides placeholder for future data management
 * - Maintains consistent provider pattern with mobile template
 */
export const DataProvider = ({ children }) => {
  const { user } = useAuth(); // Get authenticated user from AuthContext
  
  // Basic test data for template validation (same as mobile)
  const testData = "Hi!";
  
  // Global loading state for data operations
  const [loading, setLoading] = useState(false);
  
  // TODO: Add your app's data management logic here
  // 
  // EXAMPLES FOR DIFFERENT APP TYPES:
  // 
  // Blog App:
  // const [posts, setPosts] = useState([]);
  // const [categories, setCategories] = useState([]);
  // 
  // Todo App:
  // const [tasks, setTasks] = useState([]);
  // const [projects, setProjects] = useState([]);
  // 
  // E-commerce App:
  // const [products, setProducts] = useState([]);
  // const [cart, setCart] = useState([]);
  // 
  // Social App:
  // const [posts, setPosts] = useState([]);
  // const [friends, setFriends] = useState([]);
  // 
  // FIREBASE INTEGRATION EXAMPLE:
  // 
  // useEffect(() => {
  //   if (user) {
  //     const fetchUserData = async () => {
  //       setLoading(true);
  //       try {
  //         // Fetch user-specific data from Firestore
  //         const userDataRef = collection(db, `${APP_CONFIG.collectionPrefix}_data`);
  //         const q = query(userDataRef, where('userId', '==', user.uid));
  //         const snapshot = await getDocs(q);
  //         const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //         setUserSpecificData(userData);
  //       } catch (error) {
  //         console.error('Error fetching user data:', error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     
  //     fetchUserData();
  //   }
  // }, [user]);

  /**
   * Context value object containing all data state and methods
   * 
   * CURRENT STRUCTURE:
   * - testData: Simple validation string
   * - loading: Global loading state
   * - user: Authenticated user object (from AuthContext)
   * 
   * EXPAND WITH:
   * - App-specific data arrays/objects
   * - CRUD functions for data management
   * - Real-time data subscriptions
   * - Caching and synchronization logic
   */
  const value = {
    testData,
    loading,
    user,
    // Add your app-specific values and functions here:
    // posts,
    // setPosts,
    // createPost,
    // updatePost,
    // deletePost,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};