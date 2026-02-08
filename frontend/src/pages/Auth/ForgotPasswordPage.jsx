import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Stepper,
    Step,
    StepLabel,
    Paper,
    CircularProgress,
} from '@mui/material';
import { Email, Lock, ConfirmationNumber, DirectionsRun, ArrowBack } from '@mui/icons-material';

const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendOtp = async () => {
        if (!email) return toast.error("Please enter your email");
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/otp/send', { email });
            toast.success("OTP sent to your email");
            setActiveStep(1);
        } catch (err) {
            toast.error(err.response?.data || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) return toast.error("Please enter OTP");
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/otp/verify', { email, otp });
            toast.success("OTP Verified");
            setActiveStep(2);
        } catch (err) {
            toast.error(err.response?.data || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) return toast.error("Please enter all fields");
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/otp/reset-password', {
                email,
                otp,
                newPassword
            });
            toast.success("Password reset successfully! Please login.");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Simple Header */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <DirectionsRun sx={{ fontSize: 32, color: '#e63946', mr: 1 }} />
                <Typography variant="h6" fontWeight={700}>SOLECRAFT</Typography>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/login')} sx={{ ml: 'auto' }}>
                    Back to Login
                </Button>
            </Box>

            <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper sx={{ p: 4, width: '100%', borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                    <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
                        Forgot Password?
                    </Typography>
                    <Typography color="text.secondary" align="center" sx={{ mb: 4 }}>
                        Follow the steps to reset your password
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {activeStep === 0 && (
                        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 3 }}
                                InputProps={{ startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} /> }}
                                required
                            />
                            <Button fullWidth variant="contained" size="large" type="submit" disabled={loading} sx={{ bgcolor: '#e63946' }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                            </Button>
                        </Box>
                    )}

                    {activeStep === 1 && (
                        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                We sent a 6-digit code to <b>{email}</b>
                            </Typography>
                            <TextField
                                fullWidth
                                label="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                sx={{ mb: 3 }}
                                InputProps={{ startAdornment: <ConfirmationNumber sx={{ color: 'text.secondary', mr: 1 }} /> }}
                                required
                            />
                            <Button fullWidth variant="contained" size="large" type="submit" disabled={loading} sx={{ bgcolor: '#e63946' }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code'}
                            </Button>
                            <Button fullWidth sx={{ mt: 1 }} onClick={() => setActiveStep(0)}>
                                Change Email
                            </Button>
                        </Box>
                    )}

                    {activeStep === 2 && (
                        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                sx={{ mb: 2 }}
                                InputProps={{ startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1 }} /> }}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={{ mb: 3 }}
                                InputProps={{ startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1 }} /> }}
                                required
                            />
                            <Button fullWidth variant="contained" size="large" type="submit" disabled={loading} sx={{ bgcolor: '#e63946' }}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default ForgotPasswordPage;
