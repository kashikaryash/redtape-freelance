import React, { useState } from 'react';
import { FaFacebookF, FaXTwitter, FaYoutube, FaInstagram } from 'react-icons/fa6';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Button,
  IconButton,
  Divider,
  Collapse
} from '@mui/material';

const Footer = () => {
  const [showContact, setShowContact] = useState(false);

  const toggleContact = () => {
    setShowContact(!showContact);
  };

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', pt: 8, pb: 4, mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">

          {/* Shop */}
          <Grid item xs={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom fontWeight="bold">
              Shop
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {['Men', 'Women', 'Kids', 'Accessories'].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1 }}>
                  <Link href="#" variant="body2" color="text.secondary" underline="hover">
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Help */}
          <Grid item xs={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom fontWeight="bold">
              Help
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {['About Us', 'Contact Us', 'My Account', 'Store Locator', 'Store Expansion', 'FAQs'].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1 }}>
                  <Link href="#" variant="body2" color="text.secondary" underline="hover">
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Read More + Contact Info */}
          <Grid item xs={12} md={5}>
            <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
              <Typography variant="body1" paragraph>
                Sign up now and be the first to know about exclusive offers,<br />
                latest fashion news & style tips!
              </Typography>
              <Button
                onClick={toggleContact}
                color="secondary"
                sx={{ textDecoration: 'underline', fontWeight: 'bold' }}
              >
                {showContact ? 'Read Less' : 'Read More'}
              </Button>

              <Collapse in={showContact}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'left' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    CONTACT US
                  </Typography>
                  <Typography variant="body2" paragraph>
                    You can reach out to us via email at{' '}
                    <Link href="mailto:customercare@redtapeindia.com" fontWeight="bold">
                      customercare@redtapeindia.com
                    </Link>. Our customer care team is also available at{' '}
                    <Link href="tel:+917796766161" fontWeight="bold">
                      +91 7796766161
                    </Link> (Weekdays 09:30 A.M. to 05:00 P.M.).
                  </Typography>
                  <Typography variant="body2">
                    We are committed to providing you with the best possible support and ensuring your
                    experience with RedTape is nothing short of excellent.
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ mb: 3 }}>
            {[FaFacebookF, FaXTwitter, FaYoutube, FaInstagram].map((Icon, index) => (
              <IconButton key={index} color="inherit" component="a" href="#">
                <Icon size={20} />
              </IconButton>
            ))}
          </Box>

          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {['Return', 'Terms and Conditions', 'Privacy Policy'].map((text) => (
              <Link key={text} href={`#${text.toLowerCase().replace(/ /g, '')}`} color="text.primary" variant="body2" underline="hover">
                {text}
              </Link>
            ))}
          </Box>

          <Typography variant="caption" color="text.secondary" align="center" display="block">
            The content of this site is copyright-protected and is the property of <strong>RedTape</strong>
          </Typography>

          <Box
            component="img"
            src="https://redtapeproduction.myshopify.com/cdn/shop/files/logo.png?v=1709199708&width=180"
            alt="RedTape Logo"
            sx={{ width: 80, mt: 2, opacity: 0.8 }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;