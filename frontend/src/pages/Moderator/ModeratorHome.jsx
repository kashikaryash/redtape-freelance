import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from '@mui/material';
import {
    Inventory,
    AddCircle,
    ShoppingCart,
    Star,
    DirectionsRun,
    Logout,
    Dashboard,
    Security,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

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
        title: 'Reviews',
        link: '/admin/reviews',
        description: 'Check customer reviews and feedback.',
        icon: Star,
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
];

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

const ModeratorHome = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            }}
        >
            {/* Navigation */}
            <AppBar
                position="static"
                elevation={0}
                sx={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            >
                <Toolbar>
                    <Box
                        component={Link}
                        to="/moderatorHome"
                        sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                    >
                        <DirectionsRun sx={{ fontSize: 32, color: '#e63946', mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                            SOLECRAFT
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                ml: 2,
                                px: 1.5,
                                py: 0.5,
                                bgcolor: 'rgba(124, 58, 237, 0.2)', // Purple for Moderators
                                color: '#d8b4fe',
                                borderRadius: 1,
                                fontWeight: 600,
                            }}
                        >
                            MODERATOR PANEL
                        </Typography>
                    </Box>
                    <Button
                        startIcon={<Dashboard />}
                        onClick={() => navigate('/')}
                        sx={{ color: 'white', mr: 2 }}
                    >
                        Store
                    </Button>
                    <Button
                        startIcon={<Avatar sx={{ width: 24, height: 24 }} src={user?.profilePicture} />}
                        onClick={() => navigate('/my-profile')}
                        sx={{ color: 'white', mr: 2 }}
                    >
                        Profile
                    </Button>
                    <Button
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{ color: 'white' }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                mx: 'auto',
                                mb: 3,
                                bgcolor: '#7c3aed', // Purple for Moderators
                                fontSize: 40,
                                boxShadow: '0 10px 40px rgba(124, 58, 237, 0.4)',
                            }}
                        >
                            <Security fontSize="large" />
                        </Avatar>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: 'white',
                                mb: 1,
                            }}
                        >
                            Welcome, {user?.name?.split(' ')[0] || 'Moderator'}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}
                        >
                            Manage products, orders, and reviews
                        </Typography>
                    </Box>
                </motion.div>

                {/* Dashboard Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid container spacing={3}>
                        {cards.map((card, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <motion.div variants={cardVariants}>
                                    <Paper
                                        component={Link}
                                        to={card.link}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textDecoration: 'none',
                                            borderRadius: 3,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            background: 'rgba(255,255,255,0.95)',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 4,
                                                background: card.gradient,
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 2,
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: card.gradient,
                                            }}
                                        >
                                            <card.icon sx={{ fontSize: 28, color: 'white' }} />
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 600, color: '#1a1a2e', mb: 1 }}
                                        >
                                            {card.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary', lineHeight: 1.5 }}
                                        >
                                            {card.description}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default ModeratorHome;
