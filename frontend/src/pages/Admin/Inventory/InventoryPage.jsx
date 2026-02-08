import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Tabs,
    Tab,
    CircularProgress,
} from '@mui/material';
import {
    Inventory,
    Warning,
    Error as ErrorIcon,
    CheckCircle,
    Edit,
    Refresh,
    ArrowBack,
} from '@mui/icons-material';

const API_URL = 'http://localhost:8080/api';

function InventoryPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [tab, setTab] = useState(0);
    const [editDialog, setEditDialog] = useState({ open: false, product: null });
    const [newQuantity, setNewQuantity] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/inventory/summary`);
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = async () => {
        if (!editDialog.product || newQuantity === '') return;

        setSaving(true);
        try {
            await axios.put(
                `${API_URL}/admin/inventory/${editDialog.product.modelNo}/stock?quantity=${parseInt(newQuantity)}`
            );
            await fetchSummary();
            setEditDialog({ open: false, product: null });
            setNewQuantity('');
        } catch (error) {
            console.error('Error updating stock:', error);
            alert(error.response?.data?.message || 'Failed to update stock');
        } finally {
            setSaving(false);
        }
    };

    const openEditDialog = (product) => {
        setEditDialog({ open: true, product });
        setNewQuantity(product.quantity.toString());
    };

    const getStockStatus = (product) => {
        if (product.quantity === 0) {
            return { label: 'Out of Stock', color: 'error', icon: <ErrorIcon /> };
        } else if (product.quantity <= product.lowStockThreshold) {
            return { label: 'Low Stock', color: 'warning', icon: <Warning /> };
        } else {
            return { label: 'In Stock', color: 'success', icon: <CheckCircle /> };
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(price);

    if (!user || (!user.roles?.includes('ROLE_ADMIN') && !user.roles?.includes('ROLE_MODERATOR'))) {
        return (
            <Container sx={{ mt: 10, textAlign: 'center' }}>
                <Typography variant="h5">Access Denied</Typography>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container sx={{ mt: 10, textAlign: 'center' }}>
                <CircularProgress color="error" />
            </Container>
        );
    }

    const currentProducts = tab === 0 ? summary?.lowStockProducts : summary?.outOfStockProducts;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={() => navigate('/adminHome')} sx={{ mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" fontWeight={700}>
                        <Inventory sx={{ mr: 1, verticalAlign: 'middle', color: '#e63946' }} />
                        Inventory Management
                    </Typography>
                    <Typography color="text.secondary">Monitor and manage product stock levels</Typography>
                </Box>
                <Button startIcon={<Refresh />} onClick={fetchSummary} variant="outlined">
                    Refresh
                </Button>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                            color: 'white',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Warning sx={{ fontSize: 48 }} />
                                <Box>
                                    <Typography variant="h3" fontWeight={700}>
                                        {summary?.lowStockCount || 0}
                                    </Typography>
                                    <Typography>Low Stock Items</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                            color: 'white',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <ErrorIcon sx={{ fontSize: 48 }} />
                                <Box>
                                    <Typography variant="h3" fontWeight={700}>
                                        {summary?.outOfStockCount || 0}
                                    </Typography>
                                    <Typography>Out of Stock</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                            color: 'white',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CheckCircle sx={{ fontSize: 48 }} />
                                <Box>
                                    <Typography variant="h3" fontWeight={700}>
                                        {(summary?.lowStockCount || 0) + (summary?.outOfStockCount || 0) === 0
                                            ? '✓'
                                            : 'Alert'}
                                    </Typography>
                                    <Typography>
                                        {(summary?.lowStockCount || 0) + (summary?.outOfStockCount || 0) === 0
                                            ? 'All Stocked'
                                            : 'Needs Attention'}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    sx={{
                        '& .MuiTab-root': { fontWeight: 600 },
                        '& .Mui-selected': { color: '#e63946' },
                    }}
                    TabIndicatorProps={{ sx: { bgcolor: '#e63946' } }}
                >
                    <Tab
                        label={`Low Stock (${summary?.lowStockCount || 0})`}
                        icon={<Warning color="warning" />}
                        iconPosition="start"
                    />
                    <Tab
                        label={`Out of Stock (${summary?.outOfStockCount || 0})`}
                        icon={<ErrorIcon color="error" />}
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            {/* Product Table */}
            {currentProducts?.length === 0 ? (
                <Alert severity="success" sx={{ mt: 4 }}>
                    {tab === 0 ? 'No low stock products!' : 'No out of stock products!'}
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell>Product</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell align="center">Current Stock</TableCell>
                                <TableCell align="center">Threshold</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentProducts?.map((product) => {
                                const status = getStockStatus(product);
                                return (
                                    <TableRow key={product.modelNo} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <img
                                                    src={product.img1 || '/placeholder.jpg'}
                                                    alt={product.name}
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        objectFit: 'cover',
                                                        borderRadius: 8,
                                                    }}
                                                />
                                                <Box>
                                                    <Typography fontWeight={600}>{product.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        #{product.modelNo}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.category}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>{formatPrice(product.price)}</TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                fontWeight={700}
                                                color={product.quantity === 0 ? 'error' : 'warning.main'}
                                            >
                                                {product.quantity}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">{product.lowStockThreshold}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={status.label}
                                                color={status.color}
                                                size="small"
                                                icon={status.icon}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                onClick={() => openEditDialog(product)}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Edit Stock Dialog */}
            <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, product: null })}>
                <DialogTitle>Update Stock Quantity</DialogTitle>
                <DialogContent>
                    {editDialog.product && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                {editDialog.product.name}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                Current Stock: {editDialog.product.quantity}
                            </Typography>
                            <TextField
                                fullWidth
                                type="number"
                                label="New Quantity"
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(e.target.value)}
                                inputProps={{ min: 0 }}
                                sx={{ mt: 2 }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog({ open: false, product: null })}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdateStock}
                        disabled={saving || newQuantity === ''}
                        sx={{ bgcolor: '#e63946', '&:hover': { bgcolor: '#d62839' } }}
                    >
                        {saving ? 'Saving...' : 'Update Stock'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default InventoryPage;
