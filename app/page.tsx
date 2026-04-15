import { Metadata } from 'next';
import { Container, Grid, Typography, Box } from '@mui/material';
import { PLATFORMS } from '@/lib/platforms';
import PlatformCard from '@/components/PlatformCard';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'RetroVault - Your Retro Gaming Collection',
  description: 'Track and discover classic games from retro gaming consoles including NES, SNES, PlayStation, and more.',
  openGraph: {
    title: 'RetroVault - Your Retro Gaming Collection',
    description: 'Track and discover classic games from retro gaming consoles',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    type: 'website',
  },
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  const platforms = Object.values(PLATFORMS);

  return (
    <>
      <Header user={profile} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Choose Your Platform
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore thousands of classic games from gaming's golden age
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {platforms.map((platform) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={platform.slug}>
              <PlatformCard platform={platform} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
