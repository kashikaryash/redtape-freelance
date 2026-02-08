import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
    Divider,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    DirectionsRun,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Role-based redirect
            const roles = result.user?.roles || [];
            if (roles.includes('ROLE_ADMIN')) {
                navigate('/adminHome');
            } else if (roles.includes('ROLE_MODERATOR')) {
                navigate('/moderatorHome');
            } else {
                navigate('/home');
            }
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(230,57,70,0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    animation: 'pulse 4s ease-in-out infinite',
                    '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
                        '50%': { transform: 'scale(1.2)', opacity: 0.8 },
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    animation: 'pulse 5s ease-in-out infinite reverse',
                }}
            />

            {/* Left Side - Branding */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 6,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 4,
                        }}
                    >
                        <DirectionsRun sx={{ fontSize: 64, color: '#e63946', mr: 2 }} />
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #e63946 0%, #f4a261 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            SOLECRAFT
                        </Typography>
                    </Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 300,
                            mb: 2,
                            letterSpacing: 4,
                        }}
                    >
                        STEP INTO STYLE
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            opacity: 0.7,
                            maxWidth: 400,
                            lineHeight: 1.8,
                        }}
                    >
                        Premium footwear for those who dare to stand out.
                        Discover our exclusive collection of shoes designed for comfort and elegance.
                    </Typography>
                </Box>

                {/* Floating Shoe Images */}
                <Box
                    sx={{
                        mt: 6,
                        fontSize: 120,
                        animation: 'float 3s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-20px)' },
                        },
                    }}
                >
                    👟
                </Box>
            </Box>

            {/* Right Side - Login Form */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={24}
                        sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1a1a2e',
                                    mb: 1,
                                }}
                            >
                                Welcome Back
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Sign in to continue your shopping journey
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#e63946' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#e63946' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box sx={{ textAlign: 'right', mb: 3 }}>
                                <Link
                                    to="/forgot-password"
                                    style={{
                                        color: '#e63946',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #e63946 0%, #d62839 100%)',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 15px rgba(230, 57, 70, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #d62839 0%, #c1252e 100%)',
                                        boxShadow: '0 6px 20px rgba(230, 57, 70, 0.5)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        <Divider sx={{ my: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                                OR
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    style={{
                                        color: '#e63946',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Create Account
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default LoginPage;
