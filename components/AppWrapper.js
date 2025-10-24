'use client';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';

/**
 * Main app wrapper component that handles:
 * - Loading states during authentication
 * - Global theme application
 * - Header navigation when user is authenticated
 * - Responsive content container
 */
const AppWrapper = ({ children }) => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: theme.background,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress sx={{ color: theme.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: theme.background,
      color: theme.textPrimary,
      minHeight: '100vh',
      transition: 'background-color 0.2s, color 0.2s', // Smooth theme transitions
    }}>
      {/* Header navigation bar */}
      <Header />
      
      {/* Main content container with responsive design */}
      <Box
        component="main"
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: user ? 4 : 0, // Add padding only when user is logged in
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppWrapper;