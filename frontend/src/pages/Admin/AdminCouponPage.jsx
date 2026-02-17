import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    Alert
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';

const API_URL = 'https://steadfast-rejoicing-production.up.railway.app/api/admin/coupons';

const AdminCouponPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        minOrderAmount: 0,
        maxDiscount: 0,
        usageLimit: 0,
        validUntil: '',
        isActive: true
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoupons(res.data);
        } catch (err) {
            console.error("Failed to fetch coupons", err);
        }
    };

    const handleOpen = (coupon = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                ...coupon,
                validUntil: coupon.validUntil ? coupon.validUntil.slice(0, 16) : ''
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                code: '',
                description: '',
                discountType: 'PERCENTAGE',
                discountValue: 0,
                minOrderAmount: 0,
                maxDiscount: 0,
                usageLimit: 0,
                validUntil: '',
                isActive: true
            });
        }
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (editingCoupon) {
                await axios.put(`${API_URL}/${editingCoupon.id}`, formData, { headers });
            } else {
                await axios.post(API_URL, formData, { headers });
            }
            fetchCoupons();
            setOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save coupon');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCoupons();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Coupon Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Create Coupon
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Discount</TableCell>
                            <TableCell>Min Order</TableCell>
                            <TableCell>Usage</TableCell>
                            <TableCell>Expiry</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coupons.map((coupon) => (
                            <TableRow key={coupon.id}>
                                <TableCell>
                                    <Typography fontWeight="bold">{coupon.code}</Typography>
                                    <Typography variant="caption">{coupon.description}</Typography>
                                </TableCell>
                                <TableCell>
                                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                </TableCell>
                                <TableCell>₹{coupon.minOrderAmount}</TableCell>
                                <TableCell>{coupon.usedCount} / {coupon.usageLimit || '∞'}</TableCell>
                                <TableCell>{coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'Never'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={coupon.isActive ? 'Active' : 'Inactive'}
                                        color={coupon.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(coupon)} color="primary"><Edit /></IconButton>
                                    <IconButton onClick={() => handleDelete(coupon.id)} color="error"><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Coupon Code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                select
                                label="Type"
                                value={formData.discountType}
                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                fullWidth
                            >
                                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                                <MenuItem value="FIXED">Fixed Amount</MenuItem>
                            </TextField>
                            <TextField
                                type="number"
                                label="Value"
                                value={formData.discountValue}
                                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                type="number"
                                label="Min Order Amount"
                                value={formData.minOrderAmount}
                                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                type="number"
                                label="Max Discount (for %)"
                                value={formData.maxDiscount}
                                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                fullWidth
                                disabled={formData.discountType === 'FIXED'}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                type="number"
                                label="Usage Limit (0 = Unlimited)"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                type="datetime-local"
                                label="Valid Until"
                                value={formData.validUntil}
                                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminCouponPage;
