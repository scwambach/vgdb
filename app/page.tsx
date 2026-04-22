import { Metadata } from "next";
import { Container, Grid, Typography, Box } from "@mui/material";
import { PLATFORMS } from "@/lib/platforms";
import PlatformCard from "@/components/PlatformCard";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "RetroVault - Your Retro Gaming Collection",
  description:
    "Track and discover classic games from retro gaming consoles including NES, SNES, PlayStation, and more.",
  openGraph: {
    title: "RetroVault - Your Retro Gaming Collection",
    description: "Track and discover classic games from retro gaming consoles",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    type: "website",
  },
};

export default async function HomePage() {
  const platforms = Object.values(PLATFORMS);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Choose Your Platform
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore thousands of classic games from gaming&apos;s golden age
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
