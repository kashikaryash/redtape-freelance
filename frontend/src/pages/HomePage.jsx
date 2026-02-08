import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Badge,
    AppBar,
    Toolbar,
    Chip,
} from '@mui/material';
import {
    ShoppingCart,
    Person,
    DirectionsRun,
    LocalShipping,
    CreditCard,
    Replay,
    Star,
    ArrowForward,
    Favorite,
    KeyboardArrowDown,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import RecentlyViewedSection from '../components/RecentlyViewedSection';
import RecommendedSection from '../components/RecommendedSection';
import HeroSlider from '../components/HeroSlider';
import FlashSaleSection from '../components/FlashSaleSection';

const HomePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const featuredProducts = [
        {
            id: 1,
            name: 'Urban Runner Pro',
            price: 2999,
            originalPrice: 4999,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
            category: 'Running',
            rating: 4.8,
        },
        {
            id: 2,
            name: 'Classic Leather Oxford',
            price: 3499,
            originalPrice: 5499,
            image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400',
            category: 'Formal',
            rating: 4.9,
        },
        {
            id: 3,
            name: 'Street Style Sneakers',
            price: 2499,
            originalPrice: 3999,
            image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
            category: 'Casual',
            rating: 4.7,
        },
        {
            id: 4,
            name: 'Premium Sports Max',
            price: 4999,
            originalPrice: 7999,
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
            category: 'Sports',
            rating: 4.9,
        },
    ];

    const categories = [
        { name: 'Men', image: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=300', count: '250+ Styles' },
        { name: 'Women', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300', count: '180+ Styles' },
        { name: 'Kids', image: 'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=300', count: '120+ Styles' },
    ];

    const handleShopNow = () => {
        if (!user) {
            //toast.error("Please login to shop");
            navigate('/login');
            return;
        }
        navigate('/products');
    };

    return (
        <Box sx={{ bgcolor: '#f8fafc' }}>
            {/* Navigation */}
            <Navbar />

            {/* Hero Slider */}
            <HeroSlider />

            {/* Flash Sale Section */}
            <FlashSaleSection />

            {/* Features Section */}
            < Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    {[
                        { icon: LocalShipping, title: 'Free Shipping', desc: 'On orders over ₹999' },
                        { icon: CreditCard, title: 'Secure Payment', desc: '100% secure checkout' },
                        { icon: Replay, title: 'Easy Returns', desc: '30-day return policy' },
                        { icon: Star, title: 'Premium Quality', desc: 'Crafted with care' },
                    ].map((feature, index) => (
                        <Grid size={{ xs: 6, md: 3 }} key={index}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    p: 3,
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'white',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        transform: 'translateY(-5px)',
                                    },
                                }}
                            >
                                <feature.icon sx={{ fontSize: 48, color: '#e63946', mb: 2 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {feature.title}
                                </Typography>
                                <Typography color="text.secondary">{feature.desc}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container >

            {/* Recommended Products Section */}
            <RecommendedSection />

            {/* Recently Viewed Products */}
            <RecentlyViewedSection />

            {/* Categories Section */}
            < Box sx={{ bgcolor: '#1a1a2e', py: 10 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        sx={{ textAlign: 'center', color: 'white', fontWeight: 700, mb: 6 }}
                    >
                        Shop by Category
                    </Typography>
                    <Grid container spacing={4}>
                        {categories.map((cat, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <Card
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        '&:hover img': {
                                            transform: 'scale(1.1)',
                                        },
                                        '&:hover .overlay': {
                                            bgcolor: 'rgba(230,57,70,0.8)',
                                        },
                                    }}
                                    onClick={() => navigate(`/products?category=${cat.name.toUpperCase()}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="350"
                                        image={cat.image}
                                        alt={cat.name}
                                        sx={{ transition: 'transform 0.5s ease' }}
                                    />
                                    <Box
                                        className="overlay"
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                                            {cat.name}
                                        </Typography>
                                        <Typography sx={{ color: 'white', opacity: 0.8 }}>
                                            {cat.count}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box >

            {/* Featured Products */}
            < Container maxWidth="lg" sx={{ py: 10 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                            Featured Products
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Our most popular picks this season
                        </Typography>
                    </Box>
                    <Button
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/products')}
                        sx={{ color: '#e63946' }}
                    >
                        View All
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    {featuredProducts.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                    },
                                }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        image={product.image}
                                        alt={product.name}
                                    />
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            bgcolor: 'white',
                                            '&:hover': { bgcolor: '#fee2e2', color: '#e63946' },
                                        }}
                                    >
                                        <Favorite />
                                    </IconButton>
                                    <Chip
                                        label={`${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF`}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 10,
                                            left: 10,
                                            bgcolor: '#e63946',
                                            color: 'white',
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                                <CardContent>
                                    <Chip label={product.category} size="small" sx={{ mb: 1 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {product.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                        <Star sx={{ color: '#fbbf24', fontSize: 18 }} />
                                        <Typography variant="body2">{product.rating}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#e63946' }}>
                                            ₹{product.price.toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                        >
                                            ₹{product.originalPrice.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container >

            {/* CTA Section - Hide if logged in */}
            {!user && (
                <Box
                    sx={{
                        py: 8,
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                        textAlign: 'center',
                        color: 'white',
                    }}
                >
                    <Container maxWidth="md">
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                            Get 20% Off Your First Order
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
                            Join the SOLECRAFT family and step up your sneaker game.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/signup')}
                            sx={{
                                bgcolor: '#e63946',
                                px: 6,
                                py: 1.5,
                                fontSize: '1.2rem',
                                '&:hover': {
                                    bgcolor: '#f8fafc',
                                    color: '#e63946',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                },
                            }}
                        >
                            Create Account
                        </Button>
                    </Container>
                </Box>
            )}

            {/* Footer */}
            < Box sx={{ bgcolor: '#1a1a2e', color: 'white', py: 8 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <DirectionsRun sx={{ fontSize: 36, color: '#e63946', mr: 1 }} />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    SOLECRAFT
                                </Typography>
                            </Box>
                            <Typography sx={{ opacity: 0.7, lineHeight: 1.8 }}>
                                Premium footwear brand delivering comfort and style.
                                Handcrafted excellence in every step you take.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Shop
                            </Typography>
                            {['Men', 'Women', 'Kids', 'Sale'].map((item) => (
                                <Typography key={item} sx={{ opacity: 0.7, mb: 1, cursor: 'pointer', '&:hover': { opacity: 1, color: '#e63946' } }}>
                                    {item}
                                </Typography>
                            ))}
                        </Grid>
                        <Grid size={{ xs: 6, md: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Help
                            </Typography>
                            {['Contact Us', 'FAQs', 'Shipping', 'Returns'].map((item) => (
                                <Typography key={item} sx={{ opacity: 0.7, mb: 1, cursor: 'pointer', '&:hover': { opacity: 1, color: '#e63946' } }}>
                                    {item}
                                </Typography>
                            ))}
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Newsletter
                            </Typography>
                            <Typography sx={{ opacity: 0.7, mb: 2 }}>
                                Subscribe for exclusive offers and updates
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    style={{
                                        flex: 1,
                                        padding: '12px 16px',
                                        borderRadius: 8,
                                        border: 'none',
                                        outline: 'none',
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{ bgcolor: '#e63946', '&:hover': { bgcolor: '#d62839' } }}
                                >
                                    Subscribe
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 6, pt: 4, textAlign: 'center' }}>
                        <Typography sx={{ opacity: 0.5 }}>
                            © 2024 SOLECRAFT. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box >
        </Box >
    );
};

export default HomePage;
