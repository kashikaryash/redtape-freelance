import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainNavbar from '../NavBar/MainNavbar';
import { Box } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ hideSearch = false }) => {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const { isDarkMode } = useTheme();

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Dynamic colors based on scroll and theme
    const getNavBackground = () => {
        if (scrolled || !isHome) {
            return isDarkMode ? 'rgba(15, 15, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        }
        return 'transparent';
    };

    const getTextColor = () => {
        if (scrolled || !isHome) {
            return isDarkMode ? '#ffffff' : '#1a1a2e';
        }
        return '#ffffff';
    };

    const textColor = getTextColor();

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                width: '100%',
                background: getNavBackground(),
                backdropFilter: (scrolled || !isHome) ? 'blur(10px)' : 'none',
                boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.3s ease',
                borderBottom: (scrolled || !isHome)
                    ? `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
                    : 'none',
            }}
        >
            <MainNavbar textColor={textColor} />
        </Box>
    );
};

export default Navbar;
