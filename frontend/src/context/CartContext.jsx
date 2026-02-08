import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const API_URL = "http://localhost:8080/api";

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.role === 'USER') {
            fetchCart();
        } else if (user) {
            // Clear cart if admin/moderator logs in
            setCart({ items: [], totalAmount: 0 });
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/cart`);
            setCart(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productModelNo, quantity = 1) => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/cart/add`, {
                productModelNo,
                quantity,
            });
            setCart(res.data);
            return { success: true };
        } catch (e) {
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productModelNo) => {
        try {
            setLoading(true);
            const res = await axios.delete(
                `${API_URL}/cart/remove/${productModelNo}`
            );
            setCart(res.data);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productModelNo, quantity) => {
        try {
            setLoading(true);
            const res = await axios.put(`${API_URL}/cart/update/${productModelNo}`, {
                quantity
            });
            setCart(res.data);
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            const res = await axios.delete(`${API_URL}/cart/clear`);
            setCart(res.data);
        } finally {
            setLoading(false);
        }
    };

    const getCartCount = () => {
        return cart.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
    };

    return (
        <CartContext.Provider
            value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart, getCartCount, fetchCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
