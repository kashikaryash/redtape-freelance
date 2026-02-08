import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaShoppingCart, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const CartToast = ({
  type = 'success',
  message = 'Cart updated.',
  product,
  onClose,
  onViewCart,
  duration = 4000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-success" />;
      case 'error':
        return <FaTimes className="text-danger" />;
      default:
        return <FaShoppingCart className="text-primary" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="position-fixed"
      style={{
        top: '20px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '400px'
      }}
    >
      <div
        className="card shadow-lg border-0"
        role="alert"
        aria-live="assertive"
      >
        <div className={`card-header ${getBgColor()} text-white d-flex align-items-center justify-content-between`}>
          <div className="d-flex align-items-center">
            {getIcon()}
            <span className="ms-2 fw-bold">
              {type === 'success'
                ? 'Added to Cart!'
                : type === 'error'
                ? 'Error'
                : 'Cart Update'}
            </span>
          </div>
          <button
            className="btn btn-sm text-white p-0"
            onClick={onClose}
            style={{ background: 'none', border: 'none' }}
            aria-label="Close"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {product ? (
          <div className="card-body p-3">
            <div className="d-flex align-items-center">
              <img
                src={product?.img1}
                alt={product?.name || 'Product image'}
                className="rounded"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
              <div className="ms-3 flex-grow-1">
                <h6 className="mb-1 text-truncate">{product?.name}</h6>
                <p className="mb-1 text-muted small">₹{product?.price}</p>
                <p className="mb-0 text-success small">{message}</p>
              </div>
            </div>

            {type === 'success' && onViewCart && (
              <div className="mt-3 d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm flex-grow-1"
                  onClick={onClose}
                >
                  Continue Shopping
                </button>
                <button
                  className="btn btn-primary btn-sm flex-grow-1"
                  onClick={() => {
                    onViewCart();
                    onClose();
                  }}
                >
                  View Cart
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card-body p-3">
            <p className="mb-0">{message}</p>
          </div>
        )}

        <motion.div
          className={`${getBgColor()}`}
          style={{ height: '3px' }}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};

CartToast.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info']),
  message: PropTypes.string,
  product: PropTypes.shape({
    img1: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number
  }),
  onClose: PropTypes.func.isRequired,
  onViewCart: PropTypes.func,
  duration: PropTypes.number
};

export default CartToast;
