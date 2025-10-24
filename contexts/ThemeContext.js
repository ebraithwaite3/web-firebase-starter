'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Theme from '@/lib/theme';

/**
 * Theme Context for managing light/dark mode throughout the application
 * 
 * FEATURES:
 * - Automatic system theme detection on first visit
 * - Persistent user preference storage in localStorage
 * - Smooth theme transitions with CSS transitions
 * - Consistent theme object structure shared between web and mobile
 * 
 * INTEGRATION:
 * - Uses theme object from @/lib/theme.js (same as mobile template)
 * - Provides theme colors and settings to all components
 * - Syncs with user's system preferences when no saved preference exists
 */
const ThemeContext = createContext();

/**
 * Custom hook to access theme context
 * 
 * @returns {Object} Theme context containing:
 *   - theme: Current theme object (light or dark)
 *   - isDarkMode: Boolean indicating current mode
 *   - toggleTheme: Function to switch between themes
 * 
 * @throws {Error} If used outside of ThemeProvider
 * 
 * USAGE EXAMPLE:
 * const { theme, isDarkMode, toggleTheme } = useTheme();
 * <div style={{ backgroundColor: theme.background }}>Content</div>
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme Provider Component
 * 
 * Manages theme state and provides theme context to the entire application.
 * Handles theme persistence, system preference detection, and theme switching.
 * 
 * Should wrap the entire app (typically in layout.js) to provide global theme access.
 */
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  /**
   * Initialize theme preference on component mount
   * 
   * PRIORITY ORDER:
   * 1. Check localStorage for saved user preference
   * 2. Fall back to system preference if no saved preference
   * 3. Default to light mode if system preference unavailable
   * 
   * TECHNICAL NOTES:
   * - localStorage is only available in browser (not during SSR)
   * - window.matchMedia provides system theme preference
   * - useEffect ensures this runs client-side only
   */
  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      // User has explicitly chosen a theme before
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // No saved preference - check what the user's system prefers
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
    }
  }, []); // Empty dependency array = run once on mount

  /**
   * Toggle between light and dark themes
   * 
   * FUNCTIONALITY:
   * - Switches theme mode immediately
   * - Saves preference to localStorage for persistence
   * - Updates state to trigger re-render with new theme
   * 
   * PERSISTENCE:
   * - Saves 'light' or 'dark' string to localStorage
   * - Preference persists across browser sessions
   * - Works across tabs (same origin)
   * 
   * USAGE:
   * Called by theme toggle buttons in Header.js and Settings.js
   */
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Persist the user's choice for future visits
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  /**
   * Select appropriate theme object based on current mode
   * 
   * THEME OBJECT STRUCTURE (from @/lib/theme.js):
   * - theme.background: Main background color
   * - theme.surface: Card/surface backgrounds  
   * - theme.textPrimary: Primary text color
   * - theme.textSecondary: Secondary text color
   * - theme.primary: Brand/accent color
   * - theme.border: Border colors
   * - And many more organized color values
   * 
   * CONSISTENCY:
   * - Same theme object structure as mobile template
   * - Allows easy color sharing between platforms
   * - Centralized color management in one file
   */
  const theme = isDarkMode ? Theme.dark : Theme.light;

  /**
   * Provide theme context to all child components
   * 
   * CONTEXT VALUE:
   * - theme: Complete theme object with all colors and values
   * - isDarkMode: Boolean for conditional rendering/logic
   * - toggleTheme: Function for theme switching buttons
   * 
   * COMPONENT USAGE EXAMPLES:
   * 
   * // Basic styling
   * <div style={{ backgroundColor: theme.background, color: theme.textPrimary }}>
   * 
   * // Conditional content
   * {isDarkMode ? <MoonIcon /> : <SunIcon />}
   * 
   * // Toggle button
   * <button onClick={toggleTheme}>Switch Theme</button>
   * 
   * // MUI component styling
   * <Button sx={{ backgroundColor: theme.primary }}>Click Me</Button>
   */
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};