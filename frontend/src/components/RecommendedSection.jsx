import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, Star, Favorite } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const RecommendedSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const scrollRef = React.useRef(null);
    const API_URL = 'http://localhost:8080/api';

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Determine header based on auth status (though endpoint handles both)
                const headers = user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};
                const response = await axios.get(`${API_URL}/products/recommendations`, { headers });
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    if (loading || products.length === 0) return null;

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <Box sx={{ py: 6, bgcolor: '#f8fafc' }}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
                            {user ? 'Recommended For You' : 'Trending Now'}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b' }}>
                            {user ? 'Based on your recent styles' : 'Top picks for this season'}
                        </Typography>
                    </Box>

                    {/* Scroll Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={() => scroll('left')}
                            sx={{
                                bgcolor: 'white',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: '#e63946', color: 'white', borderColor: '#e63946' },
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <IconButton
                            onClick={() => scroll('right')}
                            sx={{
                                bgcolor: 'white',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: '#e63946', color: 'white', borderColor: '#e63946' },
                            }}
                        >
                            <ArrowForward />
                        </IconButton>
                    </Box>
                </Box>

                <Box
                    ref={scrollRef}
                    sx={{
                        display: 'flex',
                        gap: 3,
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        pb: 2,
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-track': { bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 3 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#e63946', borderRadius: 3 },
                    }}
                >
                    {products.map((product) => (
                        <Card
                            key={product.modelNo}
                            onClick={() => navigate(`/products/${product.modelNo}`)}
                            sx={{
                                minWidth: 260,
                                maxWidth: 260,
                                scrollSnapAlign: 'start',
                                cursor: 'pointer',
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: 'none',
                                border: '1px solid #f1f5f9',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                    borderColor: 'transparent'
                                },
                            }}
                        >
                            <Box sx={{ position: 'relative', overflow: 'hidden', height: 260, bgcolor: '#f1f5f9' }}>
                                <CardMedia
                                    component="img"
                                    height="100%"
                                    image={product.img1 || 'https://via.placeholder.com/300?text=No+Image'}
                                    alt={product.name}
                                    sx={{
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease',
                                        '&:hover': { transform: 'scale(1.05)' },
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        bgcolor: 'white',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        '&:hover': { bgcolor: '#fee2e2', color: '#e63946' },
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle wishlist
                                    }}
                                >
                                    <Favorite sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Box>

                            <CardContent sx={{ p: 2 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#64748b',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        fontWeight: 600,
                                        display: 'block',
                                        mb: 1
                                    }}
                                >
                                    {product.category || 'Footwear'}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: '#1a1a2e',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        mb: 1,
                                    }}
                                >
                                    {product.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#e63946',
                                        }}
                                    >
                                        {formatPrice(product.price)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Star sx={{ fontSize: 16, color: '#fbbf24' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                                            4.5
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default RecommendedSection;
