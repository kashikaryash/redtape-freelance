import React from 'react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { motion } from 'framer-motion';
import { FaTrash, FaShoppingBag, FaMinus, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function CartPage() {
    const { cart, loading, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
                    <h2>Please log in to view your cart</h2>
                    <button
                        className="btn btn-danger mt-3"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        );
    }

    const cartItems = cart?.items || [];

    if (cartItems.length === 0) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
                    <FaShoppingBag size={80} className="text-muted mb-4" />
                    <h2>Your cart is empty</h2>
                    <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
                    <button
                        className="btn btn-danger mt-3"
                        onClick={() => navigate('/all-products')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </>
        );
    }

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: '100px', marginBottom: '40px' }}>
                <h2 className="mb-4">Shopping Cart</h2>

                <div className="row">
                    <div className="col-lg-8">
                        {cartItems.map((item, index) => (
                            <motion.div
                                key={item.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card mb-3 shadow-sm"
                            >
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-3 col-md-2">
                                            <img
                                                src={item.product?.img1 || '/placeholder.jpg'}
                                                alt={item.product?.name}
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '100px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="col-5 col-md-5">
                                            <h6 className="mb-1">{item.product?.name}</h6>
                                            <small className="text-muted">
                                                Color: {item.product?.color || 'N/A'}
                                            </small>
                                        </div>
                                        <div className="col-2 col-md-2 text-center">
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary p-1"
                                                    onClick={() => updateQuantity(item.product.modelNo, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="fw-bold">{item.quantity}</span>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary p-1"
                                                    onClick={() => updateQuantity(item.product.modelNo, item.quantity + 1)}
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-2 col-md-2 text-end">
                                            <strong>{formatPrice(item.productPrice * item.quantity)}</strong>
                                        </div>
                                        <div className="col-12 col-md-1 text-end mt-2 mt-md-0">
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeFromCart(item.product.modelNo)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title mb-4">Order Summary</h5>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Items ({cartItems.length})</span>
                                    <span>{formatPrice(cart.totalAmount)}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping</span>
                                    <span className="text-success">Free</span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-4">
                                    <strong>Total</strong>
                                    <strong className="text-danger">{formatPrice(cart.totalAmount)}</strong>
                                </div>

                                <button
                                    className="btn btn-danger w-100 mb-2"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Proceed to Checkout
                                </button>

                                <button
                                    className="btn btn-outline-danger w-100"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to clear your cart?')) {
                                            clearCart();
                                        }
                                    }}
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CartPage;
