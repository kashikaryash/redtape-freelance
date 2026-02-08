import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) {
            return saved === 'dark';
        }
        // Default to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

        // Apply theme to document
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.style.backgroundColor = '#0f0f1a';
            document.body.style.color = '#ffffff';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#1a1a2e';
        }

        // Apply CSS custom properties
        const root = document.documentElement;
        const colors = isDarkMode
            ? {
                '--background': '#0f0f1a',
                '--surface': '#1a1a2e',
                '--surface-elevated': '#252540',
                '--text': '#ffffff',
                '--text-secondary': '#a0a0b0',
                '--text-muted': '#6b6b7e',
                '--primary': '#e63946',
                '--border': '#333355',
                '--input-background': '#252540',
                '--input-border': '#333355',
                '--input-text': '#ffffff',
                '--input-placeholder': '#6b6b7e',
            }
            : {
                '--background': '#ffffff',
                '--surface': '#f8fafc',
                '--surface-elevated': '#f1f5f9',
                '--text': '#1a1a2e',
                '--text-secondary': '#64748b',
                '--text-muted': '#94a3b8',
                '--primary': '#e63946',
                '--border': '#e2e8f0',
                '--input-background': '#ffffff',
                '--input-border': '#e2e8f0',
                '--input-text': '#1a1a2e',
                '--input-placeholder': '#94a3b8',
            };

        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const theme = {
        isDarkMode,
        toggleTheme,
        colors: isDarkMode
            ? {
                // Base Colors
                background: '#0f0f1a',
                surface: '#1a1a2e',
                surfaceLight: '#252540',
                surfaceElevated: '#252540',

                // Text Colors
                text: '#ffffff',
                textSecondary: '#a0a0b0',
                textMuted: '#6b6b7e',
                textDisabled: '#4a4a5e',

                // Brand Colors
                primary: '#e63946',
                primaryDark: '#d62839',
                primaryLight: '#ff5764',

                // Borders & Dividers
                border: '#333355',
                borderLight: '#252540',
                divider: '#333355',

                // Form & Input
                inputBackground: '#252540',
                inputBorder: '#333355',
                inputBorderFocus: '#5555aa',
                inputText: '#ffffff',
                inputPlaceholder: '#6b6b7e',
                inputDisabledBg: '#1a1a2e',

                // State Colors
                hoverOverlay: 'rgba(255, 255, 255, 0.08)',
                activeOverlay: 'rgba(255, 255, 255, 0.12)',
            }
            : {
                // Base Colors
                background: '#ffffff',
                surface: '#f8fafc',
                surfaceLight: '#f1f5f9',
                surfaceElevated: '#ffffff',

                // Text Colors
                text: '#1a1a2e',
                textSecondary: '#64748b',
                textMuted: '#94a3b8',
                textDisabled: '#cbd5e1',

                // Brand Colors
                primary: '#e63946',
                primaryDark: '#d62839',
                primaryLight: '#ff5764',

                // Borders & Dividers
                border: '#e2e8f0',
                borderLight: '#f1f5f9',
                divider: '#e2e8f0',

                // Form & Input
                inputBackground: '#ffffff',
                inputBorder: '#e2e8f0',
                inputBorderFocus: '#94a3b8',
                inputText: '#1a1a2e',
                inputPlaceholder: '#94a3b8',
                inputDisabledBg: '#f1f5f9',

                // State Colors
                hoverOverlay: 'rgba(0, 0, 0, 0.04)',
                activeOverlay: 'rgba(0, 0, 0, 0.08)',
            },
    };

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
