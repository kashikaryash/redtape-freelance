import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  AppBar,
  Toolbar,
  Button,
  Skeleton,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Inventory,
  AddCircle,
  ShoppingCart,
  People,
  Star,
  Analytics,
  DirectionsRun,
  Logout,
  Dashboard,
  MoreVert,
  ConfirmationNumber,
  AccountCircle,
  Person,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

const API_URL = 'http://localhost:8080/api';

const cards = [
  {
    title: 'All Products',
    link: '/admin/products',
    description: 'Manage and view all available products.',
    icon: Inventory,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    title: 'Add Product',
    link: '/admin/add-product',
    description: 'Add new shoes to your collection.',
    icon: AddCircle,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    title: 'Orders',
    link: '/admin/orders',
    description: 'Track and manage customer orders.',
    icon: ShoppingCart,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    title: 'Customers',
    link: '/admin/users',
    description: 'View and manage user accounts.',
    icon: People,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    title: 'Reviews',
    link: '/admin/reviews',
    description: 'Check customer reviews and feedback.',
    icon: Star,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    title: 'Coupons',
    link: '/admin/coupons',
    description: 'Manage discount codes.',
    icon: ConfirmationNumber,
    gradient: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AdminHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

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
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login', { replace: true });
  };

  const quickStats = [
    { label: 'Total Revenue', value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats?.totalRevenue || 0), color: '#4facfe' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, color: '#e63946' },
    { label: 'Total Customers', value: stats?.userCount || 0, color: '#43e97b' },
    { label: 'Total Products', value: stats?.totalProducts || 0, color: '#fa709a' },
  ];

  const categoryData = [
    { name: 'Men', value: stats?.menProducts || 0 },
    { name: 'Women', value: stats?.womenProducts || 0 },
    { name: 'Kids', value: stats?.kidsProducts || 0 },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.background,
        pb: 8,
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* Navigation */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: colors.surface,
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <Toolbar>
          <Box
            component={Link}
            to="/adminHome"
            sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            <DirectionsRun sx={{ fontSize: 32, color: '#e63946', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text }}>
              SnapCart ADMIN
            </Typography>
          </Box>

          <IconButton onClick={toggleTheme} sx={{ color: colors.text, mr: 2 }}>
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          <Button
            startIcon={<Dashboard />}
            onClick={() => navigate('/')}
            sx={{ color: colors.text, mr: 2 }}
          >
            Store
          </Button>

          <Button
            startIcon={<AccountCircle />}
            onClick={handleMenuOpen}
            sx={{ color: colors.text }}
          >
            Profile
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                bgcolor: colors.surface,
                borderRadius: 2,
                minWidth: 180,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: `1px solid ${colors.border}`
              }
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/profile'); }}>
              <Person sx={{ mr: 1.5, fontSize: 20, color: colors.textSecondary }} />
              <Typography sx={{ color: colors.text }}>My Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1.5, fontSize: 20, color: '#e63946' }} />
              <Typography sx={{ color: colors.text }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: colors.text, fontWeight: 700 }}>
            Dashboard Overview
          </Typography>
          <Typography sx={{ color: colors.textSecondary }}>
            Welcome back, {user?.name}
          </Typography>
        </Box>

        {/* Quick Stats Rows */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {quickStats.map((stat, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: colors.surfaceElevated,
                  border: `1px solid ${colors.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {loadingStats ? (
                  <Skeleton width={100} height={40} sx={{ bgcolor: colors.border }} />
                ) : (
                  <Typography variant="h4" sx={{ color: colors.text, fontWeight: 700, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                )}
                <Typography sx={{ color: stat.color, fontWeight: 500, letterSpacing: 1 }}>
                  {stat.label.toUpperCase()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* Revenue Trend */}
          <Grid item size={{ xs: 12, lg: 8 }}>
            <Paper sx={{
              p: 3,
              borderRadius: 3,
              height: 400,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: colors.text }}>
                Revenue Trend (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={stats?.revenueTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="name" stroke={colors.textMuted} />
                  <YAxis stroke={colors.textMuted} />
                  <Tooltip contentStyle={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, color: colors.text }} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Revenue (₹)" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Order Status Distribution */}
          <Grid item size={{ xs: 12, lg: 4 }}>
            <Paper sx={{
              p: 3,
              borderRadius: 3,
              height: 400,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: colors.text }}>
                Order Status
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={stats?.orderStatusDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {(stats?.orderStatusDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, color: colors.text }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {/* Inventory by Category */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Paper sx={{
              p: 3,
              borderRadius: 3,
              height: 350,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: colors.text }}>
                Product Inventory
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="name" stroke={colors.textMuted} />
                  <YAxis stroke={colors.textMuted} />
                  <Tooltip contentStyle={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, color: colors.text }} />
                  <Bar dataKey="value" fill="#82ca9d" name="Products" radius={[5, 5, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" sx={{ color: colors.text, mb: 3, fontWeight: 600 }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              {cards.map((card, index) => (
                <Grid item size={{ xs: 6 }} key={index}>
                  <Paper
                    component={Link}
                    to={card.link}
                    sx={{
                      p: 2,
                      textDecoration: 'none',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)' },
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <Box sx={{ p: 1.5, borderRadius: 1.5, background: card.gradient }}>
                      <card.icon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: colors.text, fontWeight: 600, lineHeight: 1.2 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        Manage
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default AdminHome;
