import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBox, FaShippingFast, FaCheckCircle, FaClock, FaTimesCircle,
    FaChevronDown, FaChevronUp, FaReceipt, FaMapMarkerAlt, FaCalendar,
    FaShoppingBag, FaTruck, FaStar
} from 'react-icons/fa';
import { Stepper, Step, StepLabel } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://steadfast-rejoicing-production.up.railway.app/api';

function MyOrdersPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('all');
    const [cancelling, setCancelling] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/orders/my-orders`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (e, orderId) => {
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return;
        }

        try {
            setCancelling(orderId);
            await axios.post(`${API_URL}/orders/${orderId}/cancel`);
            await fetchOrders();
            setSelectedOrder(null);
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert(error.response?.data || 'Failed to cancel order. Please try again.');
        } finally {
            setCancelling(null);
        }
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <FaShoppingBag size={80} className="text-muted mb-4" />
                        <h2>Please log in to view your orders</h2>
                        <button
                            className="btn btn-danger btn-lg mt-3 px-5"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    </motion.div>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: '100px', minHeight: '50vh' }}>
                    <div className="text-center">
                        <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading your orders...</p>
                    </div>
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusConfig = (status) => {
        const configs = {
            'PENDING': {
                icon: FaClock,
                color: '#f59e0b',
                bg: 'rgba(245, 158, 11, 0.1)',
                text: 'Order Pending'
            },
            'PROCESSING': {
                icon: FaBox,
                color: '#3b82f6',
                bg: 'rgba(59, 130, 246, 0.1)',
                text: 'Processing'
            },
            'SHIPPED': {
                icon: FaTruck,
                color: '#8b5cf6',
                bg: 'rgba(139, 92, 246, 0.1)',
                text: 'Shipped'
            },
            'DELIVERED': {
                icon: FaCheckCircle,
                color: '#10b981',
                bg: 'rgba(16, 185, 129, 0.1)',
                text: 'Delivered'
            },
            'CANCELLED': {
                icon: FaTimesCircle,
                color: '#ef4444',
                bg: 'rgba(239, 68, 68, 0.1)',
                text: 'Cancelled'
            },
        };
        return configs[status] || configs['PENDING'];
    };

    const getProgressWidth = (status) => {
        const progress = {
            'PENDING': '25%',
            'PROCESSING': '50%',
            'SHIPPED': '75%',
            'DELIVERED': '100%',
            'CANCELLED': '0%',
        };
        return progress[status] || '0%';
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    return (
        <>
            <Navbar />
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '200px',
                marginTop: '60px'
            }}>
                <div className="container py-5">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-white mb-2">
                            <FaReceipt className="me-3" />
                            My Orders
                        </h1>
                        <p className="text-white-50">Track and manage all your orders</p>
                    </motion.div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-50px', marginBottom: '40px' }}>
                {/* Stats Cards */}
                <div className="row g-4 mb-4">
                    {[
                        { label: 'Total Orders', value: orders.length, icon: FaShoppingBag, color: '#e63946' },
                        { label: 'In Transit', value: orders.filter(o => o.status === 'SHIPPED').length, icon: FaTruck, color: '#8b5cf6' },
                        { label: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, icon: FaCheckCircle, color: '#10b981' },
                        { label: 'Total Spent', value: formatPrice(orders.reduce((sum, o) => sum + o.totalAmount, 0)), icon: FaReceipt, color: '#f59e0b', isPrice: true },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            className="col-6 col-lg-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            background: `${stat.color}15`,
                                        }}
                                    >
                                        <stat.icon size={24} style={{ color: stat.color }} />
                                    </div>
                                    <div>
                                        <small className="text-muted">{stat.label}</small>
                                        <h4 className="mb-0" style={{ color: stat.isPrice ? stat.color : '#333' }}>
                                            {stat.value}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        className="text-center py-5 bg-white rounded shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <FaBox size={80} className="text-muted mb-4" />
                        <h4>No orders yet</h4>
                        <p className="text-muted">You haven't placed any orders yet.</p>
                        <button
                            className="btn btn-danger btn-lg mt-3 px-5"
                            onClick={() => navigate('/products')}
                        >
                            <FaShoppingBag className="me-2" />
                            Start Shopping
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Filter Tabs */}
                        <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
                            {[
                                { key: 'all', label: 'All Orders' },
                                { key: 'PENDING', label: 'Pending' },
                                { key: 'PROCESSING', label: 'Processing' },
                                { key: 'SHIPPED', label: 'Shipped' },
                                { key: 'DELIVERED', label: 'Delivered' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`btn ${filter === tab.key ? 'btn-danger' : 'btn-outline-secondary'} px-4`}
                                    onClick={() => setFilter(tab.key)}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {tab.label}
                                    {tab.key !== 'all' && (
                                        <span className="badge bg-light text-dark ms-2">
                                            {orders.filter(o => o.status === tab.key).length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Orders List */}
                        <div className="row">
                            <div className="col-12">
                                <AnimatePresence>
                                    {filteredOrders.map((order, index) => {
                                        const statusConfig = getStatusConfig(order.status);
                                        const StatusIcon = statusConfig.icon;
                                        const isExpanded = selectedOrder?.id === order.id;

                                        return (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="card mb-4 border-0 shadow-sm overflow-hidden"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setSelectedOrder(isExpanded ? null : order)}
                                            >
                                                {/* Order Header */}
                                                <div className="card-header bg-white border-bottom py-3">
                                                    <div className="row align-items-center">
                                                        <div className="col-md-6">
                                                            <div className="d-flex align-items-center">
                                                                <div
                                                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                                    style={{
                                                                        width: '45px',
                                                                        height: '45px',
                                                                        background: statusConfig.bg
                                                                    }}
                                                                >
                                                                    <StatusIcon size={20} style={{ color: statusConfig.color }} />
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-0">Order #{order.id}</h6>
                                                                    <small className="text-muted">
                                                                        <FaCalendar className="me-1" size={12} />
                                                                        {formatDate(order.orderDate)} at {formatTime(order.orderDate)}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 text-md-center mt-2 mt-md-0">
                                                            <span
                                                                className="badge px-3 py-2"
                                                                style={{
                                                                    background: statusConfig.bg,
                                                                    color: statusConfig.color,
                                                                    fontSize: '0.85rem'
                                                                }}
                                                            >
                                                                {statusConfig.text}
                                                            </span>
                                                        </div>
                                                        <div className="col-md-3 text-md-end mt-2 mt-md-0">
                                                            <span className="fs-5 fw-bold" style={{ color: '#e63946' }}>
                                                                {formatPrice(order.totalAmount)}
                                                            </span>
                                                            <span className="ms-2">
                                                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Visual Timeline */}
                                                    {order.status !== 'CANCELLED' && (
                                                        <div className="mt-4 px-2">
                                                            <Stepper
                                                                activeStep={
                                                                    order.status === 'PENDING' ? 0 :
                                                                        order.status === 'PROCESSING' ? 1 :
                                                                            order.status === 'SHIPPED' ? 2 :
                                                                                order.status === 'DELIVERED' ? 3 : 0
                                                                }
                                                                alternativeLabel
                                                            >
                                                                {['Placed', 'Processing', 'Shipped', 'Delivered'].map((label) => (
                                                                    <Step key={label}>
                                                                        <StepLabel>{label}</StepLabel>
                                                                    </Step>
                                                                ))}
                                                            </Stepper>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Expanded Details */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <div className="card-body" style={{ background: '#f8f9fa' }}>
                                                                {/* Order Items */}
                                                                <h6 className="mb-3">
                                                                    <FaShoppingBag className="me-2 text-muted" />
                                                                    Order Items ({order.items?.length || 0})
                                                                </h6>

                                                                <div className="row g-3 mb-4">
                                                                    {order.items?.map((item, idx) => (
                                                                        <div key={idx} className="col-md-6">
                                                                            <div className="d-flex bg-white p-3 rounded shadow-sm">
                                                                                <img
                                                                                    src={item.product?.img1 || 'https://via.placeholder.com/80'}
                                                                                    alt={item.product?.name}
                                                                                    className="rounded"
                                                                                    style={{
                                                                                        width: '80px',
                                                                                        height: '80px',
                                                                                        objectFit: 'cover'
                                                                                    }}
                                                                                />
                                                                                <div className="ms-3 flex-grow-1">
                                                                                    <h6 className="mb-1">{item.product?.name}</h6>
                                                                                    <small className="text-muted d-block mb-2">
                                                                                        Qty: {item.quantity} × {formatPrice(item.price)}
                                                                                    </small>
                                                                                    <strong style={{ color: '#e63946' }}>
                                                                                        {formatPrice(item.price * item.quantity)}
                                                                                    </strong>
                                                                                </div>
                                                                                {order.status === 'DELIVERED' && (
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-warning align-self-start"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            navigate(`/products/${item.product?.modelNo}`);
                                                                                        }}
                                                                                    >
                                                                                        <FaStar className="me-1" />
                                                                                        Review
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                {/* Order Summary */}
                                                                {/* Cancel Button for Pending Orders */}
                                                                {order.status === 'PENDING' && (
                                                                    <div className="mb-4">
                                                                        <button
                                                                            className="btn btn-outline-danger"
                                                                            onClick={(e) => handleCancelOrder(e, order.id)}
                                                                            disabled={cancelling === order.id}
                                                                        >
                                                                            {cancelling === order.id ? (
                                                                                <>
                                                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                                                    Cancelling...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <FaTimesCircle className="me-2" />
                                                                                    Cancel Order
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                        <small className="text-muted ms-3">You can cancel while order is pending</small>
                                                                    </div>
                                                                )}

                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <div className="bg-white p-3 rounded shadow-sm">
                                                                            <h6 className="mb-3">
                                                                                <FaMapMarkerAlt className="me-2 text-danger" />
                                                                                Shipping Address
                                                                            </h6>
                                                                            <p className="text-muted mb-0 small">
                                                                                {order.shippingAddress || 'Address saved at checkout'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="bg-white p-3 rounded shadow-sm">
                                                                            <h6 className="mb-3">
                                                                                <FaReceipt className="me-2 text-success" />
                                                                                Order Summary
                                                                            </h6>
                                                                            <div className="d-flex justify-content-between small">
                                                                                <span className="text-muted">Subtotal</span>
                                                                                <span>{formatPrice(order.totalAmount)}</span>
                                                                            </div>
                                                                            <div className="d-flex justify-content-between small">
                                                                                <span className="text-muted">Shipping</span>
                                                                                <span className="text-success">Free</span>
                                                                            </div>
                                                                            <hr className="my-2" />
                                                                            <div className="d-flex justify-content-between">
                                                                                <strong>Total</strong>
                                                                                <strong style={{ color: '#e63946' }}>{formatPrice(order.totalAmount)}</strong>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {filteredOrders.length === 0 && (
                                    <div className="text-center py-5 bg-white rounded shadow-sm">
                                        <FaBox size={60} className="text-muted mb-3" />
                                        <p className="text-muted mb-0">No orders found with this filter</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default MyOrdersPage;
