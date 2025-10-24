'use client';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function DashboardPage() {
  const { testData } = useData();
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
        Welcome to Your App! 🎉
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.textPrimary, marginBottom: 2 }}>
                User Info
              </Typography>
              <Typography variant="body1" sx={{ color: theme.textSecondary, marginBottom: 1 }}>
                Email: {user?.email || 'Not available'}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.textSecondary }}>
                User ID: {user?.uid || 'Not available'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.textPrimary, marginBottom: 2 }}>
                Test Data
              </Typography>
              <Typography variant="body1" sx={{ color: theme.primary, fontWeight: 'bold' }}>
                {testData}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.textSecondary, marginTop: 1 }}>
                This comes from DataContext
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.textPrimary, marginBottom: 2 }}>
                Getting Started
              </Typography>
              <Typography variant="body1" sx={{ color: theme.textSecondary, lineHeight: 1.6 }}>
                This is your dashboard template. Customize it for your app by:
              </Typography>
              <Box component="ul" sx={{ color: theme.textSecondary, marginTop: 1 }}>
                <li>Adding your app-specific data to DataContext</li>
                <li>Creating custom components for your features</li>
                <li>Modifying the theme colors in lib/theme.js</li>
                <li>Adding new pages in the app/ directory</li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}