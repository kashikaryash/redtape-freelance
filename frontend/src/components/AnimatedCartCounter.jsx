import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const AnimatedCartCounter = ({ className = "", style = {} }) => {
  const { cartCount } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(cartCount);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartCount !== prevCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevCount(cartCount);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount, prevCount]);

  const handleClick = () => {
    navigate('/cart');
  };

  return (
    <motion.div
      className={`position-relative cursor-pointer ${className}`}
      onClick={handleClick}
      style={{ cursor: 'pointer', ...style }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={isAnimating ? {
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ duration: 0.6 }}
      >
        <FaShoppingBag size={20} />
      </motion.div>

      <AnimatePresence>
        {cartCount > 0 && (
          <motion.span
            key={cartCount}
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
            style={{ fontSize: '0.75rem', minWidth: '20px' }}
          >
            <motion.span
              key={`count-${cartCount}`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {cartCount}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pulse effect when cart is updated */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="position-absolute top-50 start-50 translate-middle rounded-circle border border-danger"
            style={{
              width: '40px',
              height: '40px',
              pointerEvents: 'none'
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedCartCounter;
