import React from 'react';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, Star, Visibility } from '@mui/icons-material';

function RecentlyViewedSection() {
    const { recentlyViewed } = useRecentlyViewed();
    const navigate = useNavigate();
    const scrollRef = React.useRef(null);

    if (!recentlyViewed || recentlyViewed.length === 0) {
        return null;
    }

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
        <Box sx={{ py: 6, bgcolor: 'rgba(0,0,0,0.02)' }}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Visibility sx={{ color: '#e63946', fontSize: 28 }} />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: '#1a1a2e',
                                letterSpacing: '-0.5px',
                            }}
                        >
                            Recently Viewed
                        </Typography>
                    </Box>

                    {/* Scroll Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={() => scroll('left')}
                            sx={{
                                bgcolor: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                '&:hover': { bgcolor: '#e63946', color: 'white' },
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <IconButton
                            onClick={() => scroll('right')}
                            sx={{
                                bgcolor: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                '&:hover': { bgcolor: '#e63946', color: 'white' },
                            }}
                        >
                            <ArrowForward />
                        </IconButton>
                    </Box>
                </Box>

                {/* Scrollable Product Cards */}
                <Box
                    ref={scrollRef}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        pb: 2,
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-track': { bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 3 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#e63946', borderRadius: 3 },
                    }}
                >
                    {recentlyViewed.map((product) => (
                        <Card
                            key={product.modelNo}
                            onClick={() => navigate(`/products/${product.modelNo}`)}
                            sx={{
                                minWidth: 220,
                                maxWidth: 220,
                                scrollSnapAlign: 'start',
                                cursor: 'pointer',
                                borderRadius: 3,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(230,57,70,0.15)',
                                },
                            }}
                        >
                            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={product.img1 || '/placeholder.jpg'}
                                    alt={product.name}
                                    sx={{
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease',
                                        '&:hover': { transform: 'scale(1.1)' },
                                    }}
                                />
                                {product.averageRating > 0 && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(0,0,0,0.7)',
                                            color: '#ffd700',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        <Star sx={{ fontSize: 14 }} />
                                        {product.averageRating.toFixed(1)}
                                    </Box>
                                )}
                            </Box>
                            <CardContent sx={{ p: 2 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#1a1a2e',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        mb: 0.5,
                                    }}
                                >
                                    {product.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#666',
                                        fontSize: '0.75rem',
                                        textTransform: 'capitalize',
                                        mb: 1,
                                    }}
                                >
                                    {product.category?.toLowerCase().replace('_', ' ')}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#e63946',
                                        fontSize: '1rem',
                                    }}
                                >
                                    {formatPrice(product.price)}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default RecentlyViewedSection;
