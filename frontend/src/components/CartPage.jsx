import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from './CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import styles from './CartPage.module.css';

function CartPage() {
  const {
    cartItems,
    loading,
    refreshCart,
    removeFromCart,
    clearCart,
    cartTotal,
    updateItemQuantity,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email');


  // Ensure cartItems is always an array
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  useEffect(() => {
  if (!userEmail) {
    navigate('/login');
  } else {
    refreshCart();
  }
}, [userEmail, refreshCart, navigate]);

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item?.product?.modelNo);
      toast.info('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      toast.info('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateItemQuantity(item?.product?.modelNo, newQuantity);
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/checkout');
    }, 1000);
  };

  return (
    <>
      <ToastContainer />
      <div className={`container py-5 ${styles.cartPageContainer}`}>
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-5 fw-bold">
              <FaShoppingCart className="me-3" />
              Your Shopping Cart
            </h1>
            <Link to="/allProducts" className="btn btn-outline-primary mt-2">
              <FaArrowLeft className="me-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your cart...</p>
          </div>
        ) : safeCartItems.length === 0 ? (
          <div className={`text-center py-5 ${styles.emptyCartContainer}`}>
            <FaShoppingCart className={styles.emptyCartIcon} />
            <h3>Your cart is empty</h3>
            <p className="lead">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/allProducts" className="btn btn-primary mt-3">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Cart Items ({safeCartItems.length})</h5>
                  <button className="btn btn-sm btn-outline-danger" onClick={handleClear}>
                    <FaTrash className="me-2" />
                    Clear Cart
                  </button>
                </div>
                <div className="card-body p-0">
                  <AnimatePresence>
                    {safeCartItems.map((item, index) => (
                      <motion.div
                        key={`${item?.product?.modelNo}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className={`border-bottom p-3 ${styles.cartItem}`}
                      >
                        <div className="row align-items-center">
                          <div className="col-md-2 col-4 mb-2 mb-md-0">
                            <img
                              src={item?.product?.img1}
                              alt={item?.product?.name}
                              className={`img-fluid rounded ${styles.cartImage}`}
                            />
                          </div>
                          <div className="col-md-4 col-8 mb-2 mb-md-0">
                            <h5 className="mb-1">{item?.product?.name}</h5>
                            <p className="text-muted small mb-0">
                              Model: {item?.product?.modelNo}
                            </p>
                          </div>
                          <div className="col-md-2 col-4">
                            <div className="input-group input-group-sm">
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                className={`form-control ${styles.quantityInput}`}
                                value={item.quantity}
                                readOnly
                              />
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="col-md-2 col-4 text-md-center">
                            <span className="fw-bold">
                              ₹{Number(item?.product?.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="col-md-2 col-4 text-md-end">
                            <button
                              className={`btn btn-sm btn-outline-danger ${styles.removeBtn}`}
                              onClick={() => handleRemove(item)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>
                      ₹{cartTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold">
                      ₹{cartTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                    </span>
                  </div>
                  <button
                    className={`btn btn-primary w-100 ${styles.checkoutBtn}`}
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCreditCard className="me-2" />
                        Proceed to Checkout
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
