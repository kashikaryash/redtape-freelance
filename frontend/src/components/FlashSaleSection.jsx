import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBolt } from 'react-icons/fa';

const API_URL = 'https://steadfast-rejoicing-production.up.railway.app/api';

const FlashSaleSection = () => {
    const [products, setProducts] = useState([]);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchFlashSales();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            // Mock countdown to midnight or use real time if available
            // For demo, we just countdown to "End of Day" or parsed time
            const now = new Date();
            const end = new Date();
            end.setHours(23, 59, 59, 999);

            const diff = end - now;

            if (diff > 0) {
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchFlashSales = async () => {
        try {
            const res = await axios.get(`${API_URL}/products/flash-sale`);
            if (res.data && res.data.length > 0) {
                setProducts(res.data);
            } else {
                throw new Error("No flash sales found");
            }
        } catch (err) {
            console.log("Using fallback mock data for flash sales");
            setProducts([
                {
                    modelNo: 'FLASH-001',
                    name: 'RedTape Runner Pro',
                    price: 4999,
                    salePrice: 2499,
                    img1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
                },
                {
                    modelNo: 'FLASH-002',
                    name: 'Urban Street Sneaker',
                    price: 3999,
                    salePrice: 1999,
                    img1: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600',
                },
                {
                    modelNo: 'FLASH-003',
                    name: 'Classic Leather Loafer',
                    price: 5999,
                    salePrice: 3499,
                    img1: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600',
                },
                {
                    modelNo: 'FLASH-004',
                    name: 'Sport Click V2',
                    price: 2999,
                    salePrice: 1499,
                    img1: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
                }
            ]);
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <Box sx={{ py: 6, background: 'linear-gradient(135deg, #e63946 0%, #a82a33 100%)', position: 'relative', overflow: 'hidden' }}>
            <Container>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <FaBolt size={32} style={{ marginRight: '1rem' }} />
                        </motion.div>
                        <Typography variant="h3" fontWeight="bold">
                            Flash Deals
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: 'rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        p: 2,
                        borderRadius: 4
                    }}>
                        <Typography variant="subtitle1" color="white" fontWeight="medium">ENDING IN:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {['hours', 'minutes', 'seconds'].map((unit, index) => (
                                <React.Fragment key={unit}>
                                    <Box sx={{
                                        bgcolor: 'white',
                                        color: '#d62839',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        minWidth: 45,
                                        textAlign: 'center',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                        <Typography fontWeight="bold" variant="h6">
                                            {String(timeLeft[unit]).padStart(2, '0')}
                                        </Typography>
                                    </Box>
                                    {index < 2 && <Typography color="white" fontWeight="bold">:</Typography>}
                                </React.Fragment>
                            ))}
                        </Box>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {products.slice(0, 4).map((product) => (
                        <Grid item xs={12} sm={6} md={3} key={product.modelNo}>
                            <motion.div
                                whileHover={{ y: -10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Card sx={{
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    height: '100%',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                        '& .grab-btn': {
                                            bgcolor: 'black',
                                            color: 'white'
                                        },
                                        '& img': {
                                            transform: 'scale(1.05)'
                                        }
                                    }
                                }}
                                    onClick={() => navigate(`/products/${product.modelNo}`)}
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 15,
                                        left: 15,
                                        bgcolor: '#ffde03',
                                        color: 'black',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        zIndex: 2,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        -{product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 20}% OFF
                                    </Box>
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        image={product.img1}
                                        alt={product.name}
                                        sx={{ transition: 'transform 0.5s ease' }}
                                    />
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" noWrap fontWeight="600" sx={{ mb: 1 }}>
                                            {product.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 1 }}>
                                            <Typography variant="h5" color="#d62839" fontWeight="bold">
                                                ₹{(product.salePrice || product.price * 0.8).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                                ₹{product.price.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Button
                                            className="grab-btn"
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                mt: 3,
                                                bgcolor: '#e63946',
                                                fontWeight: 700,
                                                py: 1,
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: '#d62839'
                                                }
                                            }}
                                        >
                                            GRAB NOW
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FlashSaleSection;
