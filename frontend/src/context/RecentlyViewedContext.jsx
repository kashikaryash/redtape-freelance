import React, { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

const MAX_ITEMS = 10;
const STORAGE_KEY = 'recentlyViewedProducts';

export function RecentlyViewedProvider({ children }) {
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setRecentlyViewed(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading recently viewed:', error);
        }
    }, []);

    // Save to localStorage whenever list changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
        } catch (error) {
            console.error('Error saving recently viewed:', error);
        }
    }, [recentlyViewed]);

    const addToRecentlyViewed = (product) => {
        if (!product || !product.modelNo) return;

        setRecentlyViewed((prev) => {
            // Remove if already exists (to move to front)
            const filtered = prev.filter((p) => p.modelNo !== product.modelNo);

            // Add to front and limit to MAX_ITEMS
            const updated = [
                {
                    modelNo: product.modelNo,
                    name: product.name,
                    price: product.price,
                    img1: product.img1,
                    category: product.category,
                    averageRating: product.averageRating,
                },
                ...filtered,
            ].slice(0, MAX_ITEMS);

            return updated;
        });
    };

    const clearRecentlyViewed = () => {
        setRecentlyViewed([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <RecentlyViewedContext.Provider
            value={{
                recentlyViewed,
                addToRecentlyViewed,
                clearRecentlyViewed,
            }}
        >
            {children}
        </RecentlyViewedContext.Provider>
    );
}

export function useRecentlyViewed() {
    const context = useContext(RecentlyViewedContext);
    if (!context) {
        throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
    }
    return context;
}

export default RecentlyViewedContext;
