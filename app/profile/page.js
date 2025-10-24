'use client';
import { Box, Typography, Card, CardContent, Avatar, Chip } from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          color: theme.textPrimary,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        Profile
      </Typography>

      <Card 
        sx={{ 
          maxWidth: 600, 
          margin: '0 auto',
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      >
        <CardContent sx={{ padding: 4, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto 2rem auto',
              backgroundColor: theme.primary,
              fontSize: '3rem',
            }}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%' }} />
            ) : (
              <Person fontSize="large" />
            )}
          </Avatar>

          <Typography variant="h5" sx={{ color: theme.textPrimary, marginBottom: 3 }}>
            {user?.displayName || 'User'}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: theme.textSecondary, marginBottom: 0.5 }}>
                EMAIL
              </Typography>
              <Typography variant="body1" sx={{ color: theme.textPrimary }}>
                {user?.email || 'Not available'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: theme.textSecondary, marginBottom: 0.5 }}>
                USER ID
              </Typography>
              <Typography variant="body2" sx={{ color: theme.textPrimary, fontFamily: 'monospace' }}>
                {user?.uid || 'Not available'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: theme.textSecondary, marginBottom: 0.5 }}>
                STATUS
              </Typography>
              <Chip 
                label="Active" 
                color="success" 
                size="small"
                sx={{ backgroundColor: theme.success, color: 'white' }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ color: theme.textSecondary, marginBottom: 0.5 }}>
                ACCOUNT CREATED
              </Typography>
              <Typography variant="body2" sx={{ color: theme.textPrimary }}>
                {user?.metadata?.creationTime 
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'Not available'
                }
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}