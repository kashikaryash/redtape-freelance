import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Chip,
    Avatar,
    IconButton,
    Rating,
    AppBar,
    Toolbar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    Delete,
    Star,
    DirectionsRun,
    ArrowBack,
    Search,
    Person,
    Inventory,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:8080/api';

const ReviewsPage = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredReviews(reviews);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredReviews(
                reviews.filter(
                    (r) =>
                        r.comment?.toLowerCase().includes(query) ||
                        r.user?.name?.toLowerCase().includes(query) ||
                        r.product?.name?.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, reviews]);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/reviews/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(response.data);
            setFilteredReviews(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Failed to load reviews');
            setLoading(false);
        }
    };

    const handleDeleteClick = (review) => {
        setSelectedReview(review);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/reviews/${selectedReview.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(reviews.filter((r) => r.id !== selectedReview.id));
            setDeleteDialogOpen(false);
            setSelectedReview(null);
        } catch (err) {
            console.error('Error deleting review:', err);
            setError('Failed to delete review');
        }
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        return (total / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => {
            if (r.rating >= 1 && r.rating <= 5) {
                dist[Math.round(r.rating)]++;
            }
        });
        return dist;
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                }}
            >
                <CircularProgress sx={{ color: '#e63946' }} size={60} />
            </Box>
        );
    }

    const ratingDist = getRatingDistribution();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            }}
        >
            {/* Navigation */}
            <AppBar position="static" elevation={0} sx={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Toolbar>
                    <IconButton onClick={() => navigate('/adminHome')} sx={{ color: 'white', mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <DirectionsRun sx={{ fontSize: 32, color: '#e63946', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', flexGrow: 1 }}>
                        SOLECRAFT Reviews
                    </Typography>
                    <Button onClick={() => navigate('/adminHome')} sx={{ color: 'white' }}>
                        Dashboard
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                            Customer Reviews
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Manage and moderate customer feedback
                        </Typography>
                    </Box>
                </motion.div>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Stats Cards */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            flex: '1 1 200px',
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        }}
                    >
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                            {reviews.length}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Total Reviews</Typography>
                    </Paper>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            flex: '1 1 200px',
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                                {getAverageRating()}
                            </Typography>
                            <Star sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Average Rating</Typography>
                    </Paper>
                    {[5, 4, 3, 2, 1].map((star) => (
                        <Paper
                            key={star}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                textAlign: 'center',
                                flex: '1 1 80px',
                                background: 'rgba(255,255,255,0.95)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>{ratingDist[star]}</Typography>
                                <Star sx={{ fontSize: 16, color: '#facc15' }} />
                            </Box>
                            <Typography variant="caption" color="text.secondary">{star} star</Typography>
                        </Paper>
                    ))}
                </Box>

                {/* Search */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by user, product, or comment..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: '#e63946' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Paper>

                {/* Reviews Table */}
                <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>User</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Product</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Model No.</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Rating</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Comment</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredReviews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                                        <Star sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                                        <Typography color="text.secondary">No reviews found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredReviews.map((review) => (
                                    <TableRow
                                        key={review.id}
                                        sx={{ '&:hover': { bgcolor: 'rgba(230,57,70,0.05)' } }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ bgcolor: '#e63946', width: 32, height: 32 }}>
                                                    <Person sx={{ fontSize: 18 }} />
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {review.user?.name || 'Anonymous'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Inventory sx={{ fontSize: 18, color: '#666' }} />
                                                <Typography variant="body2">
                                                    {review.product?.name || 'Unknown Product'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={review.product_model_no || 'N/A'}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(230, 57, 70, 0.1)',
                                                    color: '#e63946',
                                                    fontWeight: 600,
                                                    fontFamily: 'monospace'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Rating value={review.rating} readOnly size="small" />
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Typography variant="body2" sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}>
                                                {review.comment || 'No comment'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleDeleteClick(review)}
                                                sx={{ color: '#e63946' }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle sx={{ fontWeight: 600 }}>Delete Review?</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default ReviewsPage;
