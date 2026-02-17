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
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Person,
    Phone,
    DirectionsRun,
    CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        gender: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setError('Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(formData.password)) {
            setError('Password must contain at least one lowercase letter');
            return false;
        }
        if (!/\d/.test(formData.password)) {
            setError('Password must contain at least one digit');
            return false;
        }
        if (!/[@#$%^&+=!*]/.test(formData.password)) {
            setError('Password must contain at least one special character (@#$%^&+=!*)');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        const result = await signup(
            formData.name,
            formData.email,
            formData.password,
            formData.gender,
            formData.mobile
        );

        if (result.success) {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                }}
            >
                <Paper
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                    }}
                >
                    <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Account Created!
                    </Typography>
                    <Typography color="text.secondary">
                        Redirecting to login...
                    </Typography>
                </Paper>
            </Box>
        );
    }

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
                    top: '20%',
                    right: '10%',
                    width: 350,
                    height: 350,
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
                    bottom: '5%',
                    left: '5%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    animation: 'pulse 5s ease-in-out infinite reverse',
                }}
            />

            {/* Left Side - Signup Form */}
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
                            p: { xs: 3, md: 5 },
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1a1a2e',
                                    mb: 1,
                                }}
                            >
                                Create Account
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Join SnapCart and explore premium footwear
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
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2.5 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: '#e63946' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2.5 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#e63946' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Mobile Number"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Phone sx={{ color: '#e63946' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            label="Gender"
                                        >
                                            <MenuItem value="MALE">Male</MenuItem>
                                            <MenuItem value="FEMALE">Female</MenuItem>
                                            <MenuItem value="OTHER">Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2.5 }}
                                helperText="Min 8 chars, uppercase, lowercase, digit, special char"
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

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
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
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

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
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    style={{
                                        color: '#e63946',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* Right Side - Branding */}
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
                            SnapCart
                        </Typography>
                    </Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 300,
                            mb: 3,
                            letterSpacing: 4,
                        }}
                    >
                        JOIN THE MOVEMENT
                    </Typography>

                    {/* Benefits List */}
                    <Box sx={{ textAlign: 'left', maxWidth: 350, mx: 'auto' }}>
                        {[
                            'Exclusive member discounts',
                            'Early access to new arrivals',
                            'Free shipping on orders over ₹999',
                            'Easy returns within 30 days',
                        ].map((benefit, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    opacity: 0.9,
                                }}
                            >
                                <CheckCircle sx={{ color: '#4caf50', mr: 2, fontSize: 20 }} />
                                <Typography variant="body1">{benefit}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Floating Shoe */}
                <Box
                    sx={{
                        mt: 4,
                        fontSize: 100,
                        animation: 'float 3s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0) rotate(-5deg)' },
                            '50%': { transform: 'translateY(-20px) rotate(5deg)' },
                        },
                    }}
                >
                    👟
                </Box>
            </Box>
        </Box>
    );
};

export default SignupPage;
