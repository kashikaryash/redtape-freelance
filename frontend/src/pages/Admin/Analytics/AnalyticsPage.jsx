import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    IconButton,
    AppBar,
    Toolbar,
    Button,
    useTheme,
} from '@mui/material';
import {
    ArrowBack,
    DirectionsRun,
    People,
    Inventory,
    ShoppingCart,
    AttachMoney,
    TrendingUp,
    PieChart as PieChartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    AreaChart,
    Area
} from 'recharts';

const API_URL = 'http://localhost:8080/api';

const StatCard = ({ title, value, icon: Icon, gradient, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Paper
            sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                background: 'rgba(255,255,255,0.95)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: gradient,
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: '#1a1a2e' }}>
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 3,
                        background: gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                >
                    <Icon sx={{ color: 'white' }} />
                </Box>
            </Box>
            {subtitle && (
                <Typography variant="caption" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </Paper>
    </motion.div>
);

const AnalyticsPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const theme = useTheme();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/admin/analytics`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to load analytics data');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9' }}>
                <CircularProgress sx={{ color: '#e63946' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: '#1a1a2e', color: 'white' }}>
                <Toolbar>
                    <IconButton onClick={() => navigate('/adminHome')} color="inherit">
                        <ArrowBack />
                    </IconButton>
                    <DirectionsRun sx={{ mx: 2, color: '#e63946' }} />
                    <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
                        Details & Analytics
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth={false} sx={{ py: 4 }}>
                {/* Key Metrics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Total Revenue"
                            value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
                            icon={AttachMoney}
                            gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                            subtitle="Lifetime revenue"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Total Orders"
                            value={stats?.totalOrders || 0}
                            icon={ShoppingCart}
                            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            subtitle="All time orders"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Registered Users"
                            value={stats?.totalUsers || 0}
                            icon={People}
                            gradient="linear-gradient(135deg, #FDC830 0%, #F37335 100%)"
                            subtitle={`${stats?.userCount || 0} Active Customers`}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Total Products"
                            value={stats?.totalProducts || 0}
                            icon={Inventory}
                            gradient="linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)"
                            subtitle={`${stats?.menProducts || 0} Men • ${stats?.womenProducts || 0} Women`}
                        />
                    </Grid>
                </Grid>

                {/* Charts Section */}
                <Grid container spacing={4}>
                    {/* Sales Trend */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <TrendingUp sx={{ color: '#e63946', mr: 1 }} />
                                <Typography variant="h6" fontWeight={700}>Sales Trend</Typography>
                            </Box>
                            <Box sx={{ height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.revenueTrend || []}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#e63946" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            tickFormatter={(value) => `₹${value}`}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            formatter={(value) => [`₹${value}`, 'Revenue']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#e63946"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Order Status */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <PieChartIcon sx={{ color: '#3b82f6', mr: 1 }} />
                                <Typography variant="h6" fontWeight={700}>Order Status</Typography>
                            </Box>
                            <Box sx={{ height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats?.orderStatusDistribution || []} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={100}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#475569', fontWeight: 600, fontSize: 11 }}
                                        />
                                        <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AnalyticsPage;
