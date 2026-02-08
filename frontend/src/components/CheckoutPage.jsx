import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { createOrder } from '../baseUrl/OrderAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const userEmail = localStorage.getItem('email');

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'creditCard'
  });

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/cart');
      toast.info('Your cart is empty');
    }
  }, [cartItems.length, navigate, userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate fields
    const { fullName, address, city, state, zipCode, phone } = formData;
    if (!fullName || !address || !city || !state || !zipCode || !phone) {
      toast.error("Please fill all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Create order payload
    const orderData = {
      userEmail,
      items: cartItems.map(item => ({
        productId: item.product.modelNo,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: cartTotal,
      shippingAddress: `${address}, ${city}, ${state} ${zipCode}`,
      contactPhone: phone,
      paymentMethod: formData.paymentMethod,
      status: 'PLACED'
    };

    console.log('Submitting order data:', orderData);

    try {
      const response = await createOrder(orderData);
      await clearCart();
      setOrderId(response.data.id || 'XXXX'); // fallback if ID not returned
      setOrderComplete(true);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="container py-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaCheckCircle size={80} className="text-success mb-3" />
          <h2>Order Confirmed!</h2>
          <p>Your order #{orderId} has been placed successfully.</p>
          <p>A confirmation email has been sent to {userEmail}</p>
          <button className="btn btn-outline-primary me-2" onClick={() => navigate('/allProducts')}>Continue Shopping</button>
          <button className="btn btn-primary" onClick={() => navigate('/orders')}>View My Orders</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <ToastContainer />
      <div className="row mb-4">
        <div className="col">
          <h2>Checkout</h2>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/cart')}>
            <FaArrowLeft className="me-2" />Back to Cart
          </button>
        </div>
      </div>

      <div className="row">
        {/* Left Column: Form */}
        <div className="col-md-8">
          <div className="card p-4 mb-4">
            <h5>Shipping Info</h5>
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-3" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required />
              <input className="form-control mb-3" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required />
              <div className="row">
                <div className="col">
                  <input className="form-control mb-3" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div className="col">
                  <input className="form-control mb-3" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} required />
                </div>
                <div className="col">
                  <input className="form-control mb-3" name="zipCode" placeholder="ZIP" value={formData.zipCode} onChange={handleInputChange} required />
                </div>
              </div>
              <input className="form-control mb-3" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />

              <div className="mb-3">
                <label className="form-label">Payment Method:</label>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="paymentMethod" value="creditCard" checked={formData.paymentMethod === 'creditCard'} onChange={handleInputChange} />
                  <label className="form-check-label">Credit Card</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleInputChange} />
                  <label className="form-check-label">PayPal</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="paymentMethod" value="cashOnDelivery" checked={formData.paymentMethod === 'cashOnDelivery'} onChange={handleInputChange} />
                  <label className="form-check-label">Cash on Delivery</label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="col-md-4">
          <div className="card p-4">
            <h5>Order Summary</h5>
            <p>Items: {cartItems.length}</p>
            <p>Total: ₹{cartTotal.toFixed(2)}</p>
            <hr />
            {cartItems.map(item => (
              <div key={item.product.modelNo} className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <p className="mb-0">{item.product.name}</p>
                  <small>Qty: {item.quantity}</small>
                </div>
                <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
