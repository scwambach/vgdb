import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Button,
  LinearProgress,
} from '@mui/material';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username}'s Profile | RetroVault`,
    description: `View ${username}'s retro gaming collection and stats`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) {
    notFound();
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === profile.id;

  // Get user's beaten games count
  const { count: beatenCount } = await supabase
    .from('user_games')
    .select('*', { count: 'only', head: true })
    .eq('user_id', profile.id)
    .eq('is_beaten', true);

  // Get user's favorites
  const { data: favoriteGames } = await supabase
    .from('user_games')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_favorite', true)
    .limit(12);

  // Get user's collections
  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .limit(6);

  let currentUserProfile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    currentUserProfile = data;
  }

  return (
    <>
      <Header user={currentUserProfile} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                src={profile.avatar_url}
                sx={{ width: 100, height: 100, fontSize: '2rem' }}
              >
                {profile.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {profile.display_name || profile.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  @{profile.username}
                </Typography>
                {profile.bio && (
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {profile.bio}
                  </Typography>
                )}
                {profile.now_playing_game_id && (
                  <Box sx={{ mt: 2 }}>
                    <Chip label="Now Playing: [Game Name]" color="primary" />
                  </Box>
                )}
              </Box>
              {!isOwnProfile && (
                <Button variant="contained">Follow</Button>
              )}
            </Box>

            {/* Stats */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">{beatenCount || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Games Beaten
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">{favoriteGames?.length || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Favorites
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">{collections?.length || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Collections
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs value={0}>
            <Tab label="Overview" />
            <Tab label="Games Beaten" />
            <Tab label="Favorites" />
            <Tab label="Collections" />
          </Tabs>
        </Box>

        {/* Completion Progress */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Platform Progress
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                NES: 12 / 714 games (1.7%)
              </Typography>
              <LinearProgress variant="determinate" value={1.7} sx={{ mb: 2 }} />
              <Typography variant="body2" gutterBottom>
                SNES: 8 / 721 games (1.1%)
              </Typography>
              <LinearProgress variant="determinate" value={1.1} sx={{ mb: 2 }} />
            </Box>
          </CardContent>
        </Card>

        {/* Favorites */}
        {favoriteGames && favoriteGames.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Favorite Games
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Games will be displayed here based on game IDs
            </Typography>
          </Box>
        )}

        {/* Collections */}
        {collections && collections.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Public Collections
            </Typography>
            <Grid container spacing={2}>
              {collections.map((collection) => (
                <Grid item xs={12} sm={6} md={4} key={collection.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{collection.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {collection.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </>
  );
}
