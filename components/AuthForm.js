'use client';
import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  IconButton,
  InputAdornment,
  Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';

/**
 * Reusable authentication form component
 * Handles both login and signup flows based on isLogin prop
 * Includes form validation, error handling, and automatic redirect after success
 */
const AuthForm = ({ isLogin = true }) => {
  // Form state management
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  // UI state for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hooks for authentication, theming, and navigation
  const { login, signup } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  /**
   * Handle form input changes and clear errors when user types
   */
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(''); // Clear error when user starts typing
  };

  /**
   * Handle form submission for both login and signup
   * Includes validation, Firebase auth calls, and redirect on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Password confirmation check for signup
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call appropriate auth function based on form type
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, formData.username);
      }

      // Redirect to dashboard on successful authentication
      console.log('Auth successful, redirecting to dashboard');
      router.push('/dashboard');

    } catch (error) {
      console.error('Auth error:', error);
      
      // Convert Firebase error codes to user-friendly messages
      let errorMessage = 'An error occurred';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        default:
          errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background,
        padding: 2,
      }}
    >
      {/* Main form card */}
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          backgroundColor: theme.surface,
          boxShadow: `0 4px 20px ${theme.border}`,
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          {/* Form title */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              textAlign: 'center',
              color: theme.textPrimary,
              fontWeight: 'bold',
              marginBottom: 3,
            }}
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>

          {/* Form subtitle */}
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: theme.textSecondary,
              marginBottom: 4,
            }}
          >
            {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
          </Typography>

          {/* Error alert */}
          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form inputs */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Email field */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: theme.border },
                  '&:hover fieldset': { borderColor: theme.primary },
                  '&.Mui-focused fieldset': { borderColor: theme.primary },
                },
                '& .MuiInputLabel-root': { color: theme.textSecondary },
                '& .MuiInputBase-input': { color: theme.textPrimary },
              }}
            />

            {/* Username field (signup only) */}
            {!isLogin && (
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: theme.border },
                    '&:hover fieldset': { borderColor: theme.primary },
                    '&.Mui-focused fieldset': { borderColor: theme.primary },
                  },
                  '& .MuiInputLabel-root': { color: theme.textSecondary },
                  '& .MuiInputBase-input': { color: theme.textPrimary },
                }}
              />
            )}

            {/* Password field with visibility toggle */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: theme.border },
                  '&:hover fieldset': { borderColor: theme.primary },
                  '&.Mui-focused fieldset': { borderColor: theme.primary },
                },
                '& .MuiInputLabel-root': { color: theme.textSecondary },
                '& .MuiInputBase-input': { color: theme.textPrimary },
              }}
            />

            {/* Confirm password field (signup only) */}
            {!isLogin && (
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: theme.border },
                    '&:hover fieldset': { borderColor: theme.primary },
                    '&.Mui-focused fieldset': { borderColor: theme.primary },
                  },
                  '& .MuiInputLabel-root': { color: theme.textSecondary },
                  '& .MuiInputBase-input': { color: theme.textPrimary },
                }}
              />
            )}

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                marginTop: 3,
                marginBottom: 2,
                padding: 1.5,
                backgroundColor: theme.primary,
                '&:hover': { backgroundColor: theme.primary + 'CC' },
                '&:disabled': { backgroundColor: theme.textSecondary },
              }}
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            {/* Toggle between login/signup */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <MuiLink
                  component={Link}
                  href={isLogin ? '/signup' : '/login'}
                  sx={{ color: theme.primary, textDecoration: 'none' }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AuthForm;