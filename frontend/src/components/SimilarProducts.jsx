import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Skeleton, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:8080/api';

const SimilarProducts = ({ currentProductId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (currentProductId) {
            fetchSimilarProducts();
        }
    }, [currentProductId]);

    const fetchSimilarProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/products/${currentProductId}/similar`);
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch similar products", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Skeleton variant="rectangular" height={200} />;
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Frequently Bought Together
            </Typography>
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={3} key={product.modelNo}>
                        <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                            <Card
                                onClick={() => {
                                    navigate(`/products/${product.modelNo}`);
                                    window.scrollTo(0, 0);
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    height: '100%'
                                }}
                            >
                                <Box sx={{ position: 'relative', pt: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        image={product.img1 || product.imageUrl || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.category}
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                        ₹{product.price}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SimilarProducts;
