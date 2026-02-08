import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";

const ContactUs = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src="https://redtape.com/cdn/shop/files/MicrosoftTeams-image_3.jpg?v=1707894680&width=2000"
        alt="Contact Background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1
        }}
      />

      {/* Overlay content */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.6)',
          zIndex: 0
        }}
      />

      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          color: 'white',
          px: 2
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          fontWeight="bold"
          sx={{ letterSpacing: 4, mb: 4, textTransform: 'uppercase', fontSize: { xs: '2.5rem', md: '3.5rem' } }}
        >
          Contact Us
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
          You can reach out to us via email at{' '}
          <Link
            href="mailto:customercare@redtapeindia.com"
            color="primary.light" // Using light primary color or custom color
            underline="hover"
            sx={{ color: '#90caf9', fontWeight: 600 }}
          >
            customercare@redtapeindia.com
          </Link>
          .
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
          Our dedicated customer care team is also available to assist you at{' '}
          <Link
            href="tel:+917836850000"
            color="primary.light"
            underline="hover"
            sx={{ color: '#90caf9', fontWeight: 600 }}
          >
            +91 7836850000
          </Link>{' '}
          <Typography component="span" variant="body1" display="block" sx={{ mt: 1 }}>
            (Weekdays 09:30 A.M. to 05:00 P.M.)
          </Typography>
        </Typography>

        <Typography variant="h6" sx={{ mt: 4, fontWeight: 300, maxWidth: 800, mx: 'auto' }}>
          We are committed to providing you with the best possible support and ensuring your experience with RedTape is nothing short of excellent.
        </Typography>
      </Container>
    </Box>
  );
};

export default ContactUs;
