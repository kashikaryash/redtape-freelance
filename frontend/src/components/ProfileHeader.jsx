import React from 'react';
import { useNavigate } from 'react-router-dom';
import DirectionsRun from '@mui/icons-material/DirectionsRun';
import { useAuth } from '../context/AuthContext';
import { Box, Container } from '@mui/material';

const ProfileHeader = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogoClick = (e) => {
        e.preventDefault();
        if (user?.roles?.includes("ROLE_ADMIN")) {
            navigate("/adminHome");
        } else if (user?.roles?.includes("ROLE_MODERATOR")) {
            navigate("/moderatorHome");
        } else {
            navigate("/");
        }
    };

    return (
        <Box sx={{ backgroundColor: '#1a1a2e', py: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Container maxWidth="xl">
                <a
                    href="/"
                    onClick={handleLogoClick}
                    style={{
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <DirectionsRun sx={{ fontSize: 32, color: '#e63946', mr: 1 }} />
                    <span style={{
                        fontWeight: 800,
                        letterSpacing: '2px',
                        fontSize: '1.25rem',
                        color: 'white'
                    }}>
                        SOLECRAFT
                    </span>
                </a>
            </Container>
        </Box>
    );
};

export default ProfileHeader;
