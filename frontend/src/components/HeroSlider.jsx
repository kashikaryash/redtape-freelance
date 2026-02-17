import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const HeroSlider = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = 'https://steadfast-rejoicing-production.up.railway.app/api';

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await axios.get(`${API_URL}/products/featured`);
                if (response.data && response.data.length > 0) {
                    setProducts(response.data);
                } else {
                    // Fallback data if API returns empty
                    setProducts([
                        {
                            modelNo: 1,
                            name: 'Urban Runner Pro',
                            price: 2999,
                            img1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600',
                            category: 'MEN'
                        },
                        {
                            modelNo: 2,
                            name: 'Elegant Summer Dress',
                            price: 1999,
                            img1: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=1600',
                            category: 'WOMEN'
                        }
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch featured products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    useEffect(() => {
        if (products.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [products]);

    const handleShopNow = (product) => {
        navigate(`/products/${product.modelNo}`);
    };

    if (loading) return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1a1a2e' }}>
            <CircularProgress sx={{ color: '#e63946' }} />
        </Box>
    );

    if (products.length === 0) return null;

    const currentProduct = products[currentIndex];

    return (
        <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden', bgcolor: '#1a1a2e' }}>
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {/* Background Image with Overlay */}
                    <Box
                        component="img"
                        src={currentProduct.img1}
                        alt={currentProduct.name}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.6)',
                        }}
                    />
                    {/* Gradient Overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, #1a1a2e 0%, transparent 50%)',
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', // Centered content
                    zIndex: 2,
                    textAlign: 'center',
                    px: 3
                }}
            >
                <Box sx={{ maxWidth: 800 }}>
                    <motion.div
                        key={`text-${currentIndex}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#e63946',
                                fontWeight: 700,
                                letterSpacing: '0.2em',
                                fontSize: '1.2rem',
                                display: 'block',
                                mb: 2
                            }}
                        >
                            FEATURED {currentProduct.category}
                        </Typography>
                        <Typography
                            variant="h1"
                            sx={{
                                color: 'white',
                                fontWeight: 800,
                                fontSize: { xs: '3rem', md: '5rem' },
                                lineHeight: 1.1,
                                mb: 3,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}
                        >
                            {currentProduct.name}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                color: 'white',
                                mb: 4,
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}
                        >
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(currentProduct.price)}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={() => handleShopNow(currentProduct)}
                            sx={{
                                bgcolor: '#e63946',
                                px: 6,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderRadius: 0,
                                '&:hover': {
                                    bgcolor: '#d62839',
                                    transform: 'translateY(-3px)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Shop Now
                        </Button>
                    </motion.div>
                </Box>
            </Box>

            {/* Pagination Dots */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1.5,
                    zIndex: 2
                }}
            >
                {products.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        sx={{
                            width: index === currentIndex ? 32 : 12,
                            height: 4,
                            bgcolor: index === currentIndex ? '#e63946' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            borderRadius: 2
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default HeroSlider;
