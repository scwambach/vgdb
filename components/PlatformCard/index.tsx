'use client';

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { usePlatformCardLogic, Platform } from './Logic';

interface PlatformCardProps {
  platform: Platform;
}

export default function PlatformCard({ platform }: PlatformCardProps) {
  const { handleClick } = usePlatformCardLogic(platform);

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        <Box
          sx={{
            height: 180,
            backgroundColor: platform.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '2rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {platform.name}
        </Box>
        <CardContent>
          <Typography variant="h6" component="div" textAlign="center">
            {platform.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
