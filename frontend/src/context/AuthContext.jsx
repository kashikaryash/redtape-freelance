import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:8080/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/signin`, {
                email,
                password,
            });

            const { token, id, name, email: userEmail, roles } = response.data;

            const userData = { id, name, email: userEmail, roles };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    const signup = async (name, email, password, gender, mobile) => {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, {
                name,
                email,
                password,
                gender,
                mobile,
            });

            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed. Please try again.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const isAdmin = () => {
        return user?.roles?.includes('ROLE_ADMIN');
    };

    const isModerator = () => {
        return user?.roles?.includes('ROLE_MODERATOR');
    };

    const hasRole = (role) => {
        return user?.roles?.includes(role);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            logout,
            loading,
            isAdmin,
            isModerator,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
