import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaLock,
    FaCreditCard,
    FaTruck,
    FaCheckCircle,
    FaQrcode,
    FaMapMarkerAlt,
    FaTag,
    FaShoppingBag,
    FaMoneyBillWave,
    FaArrowRight,
    FaArrowLeft
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import PhoneInput from '../../../components/PhoneInput/PhoneInput';
import { useTheme } from '../../../context/ThemeContext';

const API_URL = 'https://steadfast-rejoicing-production.up.railway.app/api';

function CheckoutPage() {
    const { cart, loading, fetchCart } = useCart();
    const { user } = useAuth();
    const { isDarkMode, colors } = useTheme();
    const navigate = useNavigate();

    // State
    const [step, setStep] = useState(1);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [errors, setErrors] = useState({});

    // Address State
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [loadingAddresses, setLoadingAddresses] = useState(true);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    // Shipping Info Form
    const [shippingInfo, setShippingInfo] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchAddresses();
    }, [user, navigate]);

    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const response = await axios.get(`${API_URL}/addresses`);
            setSavedAddresses(response.data);

            // Auto-select default address
            const defaultAddr = response.data.find(addr => addr.isDefault);
            if (defaultAddr) {
                selectAddress(defaultAddr);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const selectAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setShippingInfo({
            fullName: addr.fullName,
            email: user?.email || '',
            phone: addr.phone,
            address: addr.addressLine,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
        });
        setErrors({});
    };

    const handleShippingChange = (e) => {
        // Clear selected address if user manually types
        if (selectedAddressId) setSelectedAddressId('');

        const { name, value } = e.target;
        setShippingInfo({ ...shippingInfo, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Email is invalid';

        if (!shippingInfo.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{7,15}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Invalid phone number (7-15 digits)';
        }

        if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
        if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
        if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
        if (!shippingInfo.pincode.trim()) newErrors.pincode = 'Pincode is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        setValidatingCoupon(true);
        setCouponError('');
        setCouponSuccess('');

        try {
            const response = await axios.get(`${API_URL}/coupons/validate?code=${couponCode}&cartValue=${getCartTotal()}`);
            if (response.data.valid) {
                setCouponDiscount(response.data.discountAmount);
                setCouponSuccess(`Coupon applied! You saved ₹${response.data.discountAmount}`);
            } else {
                setCouponDiscount(0);
                setCouponError(response.data.message || 'Invalid coupon');
            }
        } catch (error) {
            console.error('Coupon error:', error);
            setCouponDiscount(0);
            setCouponError(error.response?.data?.message || 'Failed to apply coupon');
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handlePlaceOrder = async () => {
        setPlacingOrder(true);
        try {
            const orderData = {
                items: cart.items.map(item => ({
                    product: { modelNo: item.product.modelNo },
                    quantity: item.quantity,
                    price: item.productPrice
                })),
                totalAmount: getFinalTotal(),
                shippingAddress: JSON.stringify(shippingInfo),
                paymentMethod: paymentMethod,
                discount: couponDiscount
            };

            const response = await axios.post(`${API_URL}/orders/place`, orderData);
            setOrderId(response.data.id);
            setOrderPlaced(true);
            fetchCart(); // Refresh cart (should be empty)
        } catch (error) {
            console.error('Order error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setPlacingOrder(false);
        }
    };

    const getCartTotal = () => {
        return cart.items?.reduce((total, item) => total + item.productPrice * item.quantity, 0) || 0;
    };

    const getImageUrl = (product) => {
        if (!product) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';
        const legacyUrl = product.img1;
        if (legacyUrl && legacyUrl.trim() !== '') {
            return legacyUrl;
        }
        return `${API_URL}/images/product/${product.modelNo}/1`;
    };

    const getFinalTotal = () => {
        const total = getCartTotal();
        const shipping = total > 500 ? 0 : 50;
        return Math.max(0, total + shipping - couponDiscount);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: colors.background }}>
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Success View
    if (orderPlaced) {
        return (
            <>
                <Navbar />
                <div style={{ background: colors.background, minHeight: '100vh', paddingTop: '100px' }}>
                    <div className="container text-center py-5">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        >
                            <FaCheckCircle className="text-success mb-4" size={80} />
                        </motion.div>
                        <h2 className="mb-3" style={{ color: colors.text }}>Order Placed Successfully!</h2>
                        <p className="lead mb-4" style={{ color: colors.textSecondary }}>
                            Thank you for your purchase. Your order ID is <strong>#{orderId}</strong>.
                        </p>
                        <button
                            className="btn btn-danger btn-lg px-5"
                            onClick={() => navigate('/products')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={{ background: colors.background, minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
                <div className="container">

                    {/* Progress Steps */}
                    <div className="row justify-content-center mb-5">
                        <div className="col-lg-8">
                            <div className="d-flex justify-content-between position-relative">
                                <div style={{
                                    position: 'absolute', top: '50%', left: 0, right: 0, height: '2px',
                                    background: colors.border, zIndex: 0, transform: 'translateY(-50%)'
                                }} />
                                {[
                                    { num: 1, label: 'Shipping', icon: <FaTruck /> },
                                    { num: 2, label: 'Payment', icon: <FaCreditCard /> },
                                    { num: 3, label: 'Review', icon: <FaCheckCircle /> }
                                ].map((s) => (
                                    <div key={s.num} className="position-relative z-1 text-center">
                                        <div
                                            className="d-flex align-items-center justify-content-center mx-auto mb-2"
                                            style={{
                                                width: '40px', height: '40px', borderRadius: '50%',
                                                background: step >= s.num ? '#e63946' : colors.surface,
                                                color: step >= s.num ? 'white' : colors.textSecondary,
                                                border: `2px solid ${step >= s.num ? '#e63946' : colors.border}`,
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            {s.icon}
                                        </div>
                                        <small style={{
                                            color: step >= s.num ? colors.text : colors.textSecondary,
                                            fontWeight: step === s.num ? 'bold' : 'normal'
                                        }}>
                                            {s.label}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Main Content Area */}
                        <div className="col-lg-8">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <div className="card border-0 shadow-sm" style={{ background: colors.surface, borderRadius: '16px' }}>
                                            <div className="card-header bg-transparent border-0 py-3">
                                                <h5 className="mb-0 fw-bold" style={{ color: colors.text }}>
                                                    <FaMapMarkerAlt className="me-2 text-danger" />
                                                    Shipping Address
                                                </h5>
                                            </div>
                                            <div className="card-body">

                                                {/* Saved Addresses Selector */}
                                                {savedAddresses.length > 0 && (
                                                    <div className="mb-4">
                                                        <label className="form-label text-muted small fw-bold text-uppercase">Saved Addresses</label>
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {savedAddresses.map(addr => (
                                                                <button
                                                                    key={addr.id}
                                                                    className={`btn btn-sm ${selectedAddressId === addr.id ? 'btn-danger' : 'btn-outline-secondary'}`}
                                                                    onClick={() => selectAddress(addr)}
                                                                >
                                                                    {addr.label}
                                                                </button>
                                                            ))}
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => {
                                                                    setSelectedAddressId('');
                                                                    setShippingInfo({
                                                                        fullName: '', email: user?.email || '', phone: '',
                                                                        address: '', city: '', state: '', pincode: ''
                                                                    });
                                                                }}
                                                            >
                                                                + New Address
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label" style={{ color: colors.textSecondary }}>Full Name</label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                                            style={{ background: colors.background, color: colors.text, borderColor: colors.border }}
                                                            name="fullName"
                                                            value={shippingInfo.fullName}
                                                            onChange={handleShippingChange}
                                                        />
                                                        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label" style={{ color: colors.textSecondary }}>Email</label>
                                                        <input
                                                            type="email"
                                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                            style={{ background: colors.background, color: colors.text, borderColor: colors.border }}
                                                            name="email"
                                                            value={shippingInfo.email}
                                                            onChange={handleShippingChange}
                                                        />
                                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label" style={{ color: colors.textSecondary }}>Phone</label>
                                                        <PhoneInput
                                                            value={shippingInfo.phone}
                                                            onChange={handleShippingChange}
                                                            error={errors.phone}
                                                            name="phone"
                                                            defaultCountry="PK"
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label className="form-label" style={{ color: colors.textSecondary }}>Address</label>
                                                        <textarea
                                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                                            style={{ background: colors.background, color: colors.text, borderColor: colors.border }}
                                                            rows="2"
                                                            name="address"
                                                            value={shippingInfo.address}
                                                            onChange={handleShippingChange}
                                                        ></textarea>
                                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label" style={{ color: colors.textSecondary }}>City</label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                                            style={{ background: colors.background, color: colors.text, borderColor: colors.border }}
                                                            name="city"
                                                            value={shippingInfo.city}
                                                            onChange={handleShippingChange}
                                                        />
                                                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label" style={{ color: colors.textSecondary }}>State</label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                                            style={{ background: colors.background, color: colors.text, borderColor: colors.border }}
                                                            name="state"
                                                            value={shippingInfo.state}
                                                            onChange={handleShippingChange}
                                                        />
                                                        {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label" style={{ color: colors.textSecondary }}>Pincode</label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                                                            style={{ background: colors.background, color: colors.text, borderColor: colors.border }}
                                                            name="pincode"
                                                            value={shippingInfo.pincode}
                                                            onChange={handleShippingChange}
                                                        />
                                                        {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
                                                    </div>
                                                </div>

                                                <div className="d-flex justify-content-end mt-4">
                                                    <button
                                                        className="btn btn-danger px-4"
                                                        onClick={() => {
                                                            if (validateStep1()) setStep(2);
                                                        }}
                                                    >
                                                        Continue to Payment <FaArrowRight className="ms-2" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <div className="card border-0 shadow-sm" style={{ background: colors.surface, borderRadius: '16px' }}>
                                            <div className="card-header bg-transparent border-0 py-3">
                                                <h5 className="mb-0 fw-bold" style={{ color: colors.text }}>
                                                    <FaCreditCard className="me-2 text-danger" />
                                                    Payment Method
                                                </h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <div
                                                            className={`p-3 border rounded cursor-pointer ${paymentMethod === 'card' ? 'border-danger bg-light-danger' : ''}`}
                                                            style={{
                                                                cursor: 'pointer',
                                                                borderColor: paymentMethod === 'card' ? '#e63946' : colors.border,
                                                                background: paymentMethod === 'card' ? 'rgba(230,57,70,0.05)' : colors.background
                                                            }}
                                                            onClick={() => setPaymentMethod('card')}
                                                        >
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="paymentMethod"
                                                                    checked={paymentMethod === 'card'}
                                                                    onChange={() => setPaymentMethod('card')}
                                                                />
                                                                <label className="form-check-label w-100" style={{ color: colors.text }}>
                                                                    <FaCreditCard className="me-2 text-danger" /> Credit / Debit Card
                                                                    <div className="small text-muted mt-1">Pay securely with your bank card</div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div
                                                            className={`p-3 border rounded cursor-pointer ${paymentMethod === 'qr' ? 'border-danger bg-light-danger' : ''}`}
                                                            style={{
                                                                cursor: 'pointer',
                                                                borderColor: paymentMethod === 'qr' ? '#e63946' : colors.border,
                                                                background: paymentMethod === 'qr' ? 'rgba(230,57,70,0.05)' : colors.background
                                                            }}
                                                            onClick={() => setPaymentMethod('qr')}
                                                        >
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="paymentMethod"
                                                                    checked={paymentMethod === 'qr'}
                                                                    onChange={() => setPaymentMethod('qr')}
                                                                />
                                                                <label className="form-check-label w-100" style={{ color: colors.text }}>
                                                                    <FaQrcode className="me-2 text-danger" /> UPI / QR Code
                                                                    <div className="small text-muted mt-1">Scan QR code to pay instantly</div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Payment Form Placeholder */}
                                                <div className="mt-4 p-3 rounded" style={{ background: colors.background }}>
                                                    {paymentMethod === 'card' ? (
                                                        <div>
                                                            <h6 className="mb-3" style={{ color: colors.text }}>Enter Card Details</h6>
                                                            <div className="row g-3">
                                                                <div className="col-12">
                                                                    <input type="text" className="form-control" placeholder="Card Number" style={{ background: colors.surface, borderColor: colors.border, color: colors.text }} />
                                                                </div>
                                                                <div className="col-6">
                                                                    <input type="text" className="form-control" placeholder="MM/YY" style={{ background: colors.surface, borderColor: colors.border, color: colors.text }} />
                                                                </div>
                                                                <div className="col-6">
                                                                    <input type="text" className="form-control" placeholder="CVV" style={{ background: colors.surface, borderColor: colors.border, color: colors.text }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4">
                                                            <FaQrcode size={100} className="mb-3" style={{ color: colors.text }} />
                                                            <p style={{ color: colors.textSecondary }}>Scan this QR Code with any UPI app</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="d-flex justify-content-between mt-4">
                                                    <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>
                                                        <FaArrowLeft className="me-2" /> Back
                                                    </button>
                                                    <button className="btn btn-danger px-4" onClick={() => handlePlaceOrder()} disabled={placingOrder}>
                                                        {placingOrder ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" /> Processing...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Pay ₹{getFinalTotal()} <FaCheckCircle className="ms-2" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm sticky-top" style={{ top: '100px', background: colors.surface, borderRadius: '16px' }}>
                                <div className="card-header bg-transparent border-0 py-3">
                                    <h5 className="mb-0 fw-bold" style={{ color: colors.text }}>
                                        <FaShoppingBag className="me-2 text-danger" />
                                        Order Summary
                                    </h5>
                                </div>
                                <div className="card-body p-0">
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="px-3">
                                        {cart.items?.map((item) => (
                                            <div key={item.id} className="d-flex align-items-center py-2 border-bottom" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                                                <img
                                                    src={getImageUrl(item.product)}
                                                    alt={item.product?.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                                <div className="ms-3 flex-grow-1">
                                                    <h6 className="mb-0 text-truncate" style={{ maxWidth: '180px', fontSize: '0.9rem', color: colors.text }}>
                                                        {item.product?.name}
                                                    </h6>
                                                    <small style={{ color: colors.textSecondary }}>Qty: {item.quantity}</small>
                                                </div>
                                                <div className="fw-bold" style={{ color: colors.text }}>
                                                    ₹{item.productPrice * item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-3">
                                        {/* Coupon Input */}
                                        <div className="input-group mb-3">
                                            <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: colors.border }}>
                                                <FaTag className="text-muted" />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0"
                                                placeholder="Coupon Code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                style={{ background: colors.background, color: colors.text, borderColor: colors.border }}
                                            />
                                            <button
                                                className="btn btn-dark"
                                                onClick={applyCoupon}
                                                disabled={validatingCoupon}
                                            >
                                                {validatingCoupon ? '...' : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-danger small mb-2">{couponError}</p>}
                                        {couponSuccess && <p className="text-success small mb-2">{couponSuccess}</p>}

                                        <div className="d-flex justify-content-between mb-2" style={{ color: colors.textSecondary }}>
                                            <span>Subtotal</span>
                                            <span>₹{getCartTotal()}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2" style={{ color: colors.textSecondary }}>
                                            <span>Shipping</span>
                                            <span>{getCartTotal() > 500 ? <span className="text-success">Free</span> : '₹50'}</span>
                                        </div>
                                        {couponDiscount > 0 && (
                                            <div className="d-flex justify-content-between mb-2 text-success">
                                                <span>Discount</span>
                                                <span>-₹{couponDiscount}</span>
                                            </div>
                                        )}
                                        <hr style={{ borderColor: colors.border }} />
                                        <div className="d-flex justify-content-between fw-bold fs-5" style={{ color: colors.text }}>
                                            <span>Total</span>
                                            <span>₹{getFinalTotal()}</span>
                                        </div>

                                        <div className="mt-3 text-center">
                                            <small style={{ color: colors.textSecondary }}>
                                                <FaLock className="me-1" size={10} />
                                                Secure Checkout
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CheckoutPage;
