'use client';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Brightness4, Brightness7, Logout } from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Main navigation header component
 * Displays different navigation options based on authentication status
 * Includes theme toggle and logout functionality
 */
const Header = () => {
  const { user, logout } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  /**
   * Handle user logout with error handling
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: theme.surface,
        borderBottom: `1px solid ${theme.border}`,
        boxShadow: 'none', // Remove default Material-UI shadow
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* App logo/title - links to dashboard */}
        <Typography 
          variant="h6" 
          component={Link} 
          href="/dashboard"
          sx={{ 
            color: theme.primary,
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          My App Starter
        </Typography>

        {/* Navigation buttons - different content based on auth status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            /* Authenticated user navigation */
            <>
              {/* Main navigation links */}
              <Button 
                component={Link} 
                href="/dashboard"
                sx={{ color: theme.textPrimary }}
              >
                Dashboard
              </Button>
              <Button 
                component={Link} 
                href="/profile"
                sx={{ color: theme.textPrimary }}
              >
                Profile
              </Button>
              <Button 
                component={Link} 
                href="/settings"
                sx={{ color: theme.textPrimary }}
              >
                Settings
              </Button>
              
              {/* Theme toggle button */}
              <IconButton onClick={toggleTheme} sx={{ color: theme.textPrimary }}>
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              
              {/* Logout button */}
              <Button 
                variant="contained" 
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{ 
                  backgroundColor: theme.primary,
                  '&:hover': { backgroundColor: theme.primary + 'CC' } // 80% opacity on hover
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            /* Unauthenticated user navigation */
            <>
              <Button 
                component={Link} 
                href="/login"
                sx={{ color: theme.textPrimary }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                href="/signup"
                variant="contained"
                sx={{ 
                  backgroundColor: theme.primary,
                  '&:hover': { backgroundColor: theme.primary + 'CC' }
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;