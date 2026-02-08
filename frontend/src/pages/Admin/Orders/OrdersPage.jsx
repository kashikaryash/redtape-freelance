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
    Chip,
    IconButton,
    AppBar,
    Toolbar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    Select,
    MenuItem,
    CircularProgress,
    Grid,
} from '@mui/material';
import {
    ArrowBack,
    DirectionsRun,
    Visibility,
    LocalShipping,
    CheckCircle,
    Cancel,
    Inventory,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:8080/api';

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/admin/orders/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Sort orders by ID descending (newest first) as a basic default
            const sortedOrders = response.data.sort((a, b) => b.id - a.id);
            setOrders(sortedOrders);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_URL}/orders/${selectedOrder.id}/status`,
                null,
                {
                    params: { status: newStatus },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Update local state
            setOrders(orders.map(order =>
                order.id === selectedOrder.id ? { ...order, status: newStatus } : order
            ));

            setStatusDialogOpen(false);
            setSelectedOrder(null);
        } catch (err) {
            console.error('Error updating status:', err);
            // You might want to show an error snackbar here
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return 'success';
            case 'SHIPPED': return 'info';
            case 'CANCELLED': return 'error';
            case 'PENDING': return 'warning';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'DELIVERED': return <CheckCircle fontSize="small" />;
            case 'SHIPPED': return <LocalShipping fontSize="small" />;
            case 'CANCELLED': return <Cancel fontSize="small" />;
            default: return <Inventory fontSize="small" />;
        }
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
                        Order Management
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                            All Orders
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Track and manage customer orders
                        </Typography>
                    </Box>
                </motion.div>

                <Paper sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Order ID</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Customer</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Total</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order, index) => (
                                    <TableRow key={order.id || index} hover>
                                        <TableCell>#{order.id}</TableCell>
                                        <TableCell>
                                            {order.user ? (
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {order.user.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {order.user.email}
                                                    </Typography>
                                                </Box>
                                            ) : 'Unknown User'}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            ₹{order.totalAmount?.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={getStatusIcon(order.status)}
                                                label={order.status}
                                                color={getStatusColor(order.status)}
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    startIcon={<Visibility />}
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setDetailsOpen(true);
                                                    }}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="small"
                                                    startIcon={<LocalShipping />}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setNewStatus(order.status);
                                                        setStatusDialogOpen(true);
                                                    }}
                                                >
                                                    Update
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {orders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography color="text.secondary">No orders found</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>

            {/* Order Details Dialog */}
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>
                    Order Details #{selectedOrder?.id}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedOrder && (
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Customer Information
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                    <Typography variant="body1" fontWeight={600}>
                                        {selectedOrder.user?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedOrder.user?.email}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Order Summary
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Order Date:</Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {new Date(selectedOrder.orderDate).toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Total Amount:</Typography>
                                        <Typography variant="body1" fontWeight={700} color="primary">
                                            ₹{selectedOrder.totalAmount?.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                                    Order Items
                                </Typography>
                                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Qty</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.items?.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <img
                                                                src={item.product?.img1}
                                                                alt={item.product?.name}
                                                                style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }}
                                                                onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                                                            />
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={600}>
                                                                    {item.product?.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {item.product?.modelNo}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">₹{item.price}</TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                    <TableCell align="right" fontWeight={600}>
                                                        ₹{item.price * item.quantity}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
                    <Button onClick={() => setDetailsOpen(false)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogContent sx={{ minWidth: 300, pt: 1 }}>
                    <FormControl fullWidth margin="dense">
                        <Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="SHIPPED">Shipped</MenuItem>
                            <MenuItem value="DELIVERED">Delivered</MenuItem>
                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleStatusUpdate} variant="contained" color="primary">
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrdersPage;
