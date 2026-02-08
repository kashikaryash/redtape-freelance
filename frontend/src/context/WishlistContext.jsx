import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);
const API_URL = 'http://localhost:8080/api';

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState({ items: [] });
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist({ items: [] });
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/wishlist`);
            setWishlist(res.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productModelNo) => {
        try {
            const res = await axios.post(`${API_URL}/wishlist/add/${productModelNo}`);
            setWishlist(res.data);
            return { success: true };
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            return { success: false };
        }
    };

    const removeFromWishlist = async (productModelNo) => {
        try {
            const res = await axios.delete(`${API_URL}/wishlist/remove/${productModelNo}`);
            setWishlist(res.data);
            return { success: true };
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return { success: false };
        }
    };

    const isInWishlist = (productModelNo) => {
        return wishlist.items?.some(item => item.product?.modelNo === productModelNo) || false;
    };

    return (
        <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
