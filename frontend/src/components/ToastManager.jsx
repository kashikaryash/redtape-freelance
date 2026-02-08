import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CartToast from './CartToast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showCartSuccess = useCallback((product, message = 'Item added to cart successfully!') => {
    return addToast({
      type: 'success',
      message,
      product,
      onViewCart: () => navigate('/cart')
    });
  }, [addToast, navigate]);

  const showCartError = useCallback((message = 'Failed to add item to cart') => {
    return addToast({
      type: 'error',
      message
    });
  }, [addToast]);

  const showCartInfo = useCallback((message) => {
    return addToast({
      type: 'info',
      message
    });
  }, [addToast]);

  const value = {
    addToast,
    removeToast,
    showCartSuccess,
    showCartError,
    showCartInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="position-fixed" style={{ top: '20px', right: '20px', zIndex: 9999 }}>
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <div key={toast.id} style={{ marginBottom: '10px' }}>
              <CartToast
                {...toast}
                onClose={() => removeToast(toast.id)}
                onViewCart={toast.onViewCart}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
