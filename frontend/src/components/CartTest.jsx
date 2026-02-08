import React, { useState } from 'react';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';

const CartTest = () => {
  const { addToCart, cartItems, cartCount, cartTotal } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('email'));

  const testProduct = {
    modelNo: 'TEST001',
    name: 'Test Product',
    price: 99.99,
    img1: 'https://via.placeholder.com/150',
    description: 'This is a test product for cart functionality'
  };

  const handleLogin = () => {
    localStorage.setItem('email', 'test@example.com');
    localStorage.setItem('role', 'USER');
    setIsLoggedIn(true);
    // Trigger custom event to notify CartContext of user change
    window.dispatchEvent(new CustomEvent('userChanged', { detail: { email: 'test@example.com' } }));
    toast.success('Logged in as test@example.com');
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    // Trigger custom event to notify CartContext of user change
    window.dispatchEvent(new CustomEvent('userChanged', { detail: { email: null } }));
    toast.info('Logged out - Cart data saved for when you log back in!');
  };

  const handleLoginDifferentUser = () => {
    localStorage.setItem('email', 'user2@example.com');
    localStorage.setItem('role', 'USER');
    setIsLoggedIn(true);
    // Trigger custom event to notify CartContext of user change
    window.dispatchEvent(new CustomEvent('userChanged', { detail: { email: 'user2@example.com' } }));
    toast.success('Logged in as user2@example.com');
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      return;
    }
    
    try {
      await addToCart(testProduct, 1);
    } catch (error) {
      console.error('Add to cart test failed:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5>Cart Functionality Test</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Login Status</h6>
              <p>Status: {isLoggedIn ? '✅ Logged in' : '❌ Not logged in'}</p>
              <p>Email: {localStorage.getItem('email') || 'None'}</p>
              
              <div className="mb-3">
                {!isLoggedIn ? (
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handleLogin}>
                      Login as Test User 1
                    </button>
                    <button className="btn btn-info" onClick={handleLoginDifferentUser}>
                      Login as Test User 2
                    </button>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <button className="btn btn-secondary" onClick={handleLogout}>
                      Logout
                    </button>
                    <button className="btn btn-warning" onClick={handleLoginDifferentUser}>
                      Switch to User 2
                    </button>
                    <button className="btn btn-success" onClick={handleLogin}>
                      Switch to User 1
                    </button>
                  </div>
                )}
              </div>

              <h6>Test Product</h6>
              <div className="card mb-3" style={{ maxWidth: '300px' }}>
                <div className="card-body">
                  <h6 className="card-title">{testProduct.name}</h6>
                  <p className="card-text">{testProduct.description}</p>
                  <p className="card-text"><strong>Price: ₹{testProduct.price}</strong></p>
                  <button 
                    className="btn btn-warning" 
                    onClick={handleAddToCart}
                    disabled={!isLoggedIn}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <h6>Cart Status</h6>
              <p>Items in cart: {cartCount}</p>
              <p>Cart total: ₹{cartTotal.toFixed(2)}</p>
              
              <h6>Cart Items</h6>
              {cartItems.length === 0 ? (
                <p className="text-muted">No items in cart</p>
              ) : (
                <div>
                  {cartItems.map((item, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body p-2">
                        <h6 className="card-title mb-1">{item.product?.name}</h6>
                        <p className="card-text mb-1">
                          Quantity: {item.quantity} | 
                          Price: ₹{item.product?.price} | 
                          Total: ₹{(item.product?.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h6>Instructions for Testing Cart Persistence</h6>
            <ol>
              <li>Click "Login as Test User 1" to simulate being logged in</li>
              <li>Click "Add to Cart" to add items to the cart</li>
              <li>Check the cart status on the right to see items are added</li>
              <li>Click "Logout" - notice the cart appears empty but data is saved</li>
              <li>Click "Login as Test User 1" again - your cart items should reappear!</li>
              <li>Try "Switch to User 2" to test different user carts</li>
              <li>Each user maintains their own separate cart</li>
              <li>Check the browser console for any error messages</li>
            </ol>
            <div className="alert alert-info mt-3">
              <strong>Note:</strong> Cart data is now persistent per user. When you logout and login again,
              your cart items will be restored automatically!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTest;
