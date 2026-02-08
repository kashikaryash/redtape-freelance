import React, { useState } from 'react';
import axios from 'axios';

const BackendTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing backend connection...');
    
    try {
      // Test if backend is running
      const response = await axios.get('/api/products/getAllProducts');
      setTestResult(`✅ Backend is running! Found ${response.data.length} products`);
    } catch (error) {
      console.error('Backend test error:', error);
      if (error.code === 'ERR_NETWORK') {
        setTestResult('❌ Backend server is not running on port 8080');
      } else if (error.response) {
        setTestResult(`❌ Backend error: ${error.response.status} - ${error.response.statusText}`);
      } else {
        setTestResult(`❌ Connection error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testCartAPI = async () => {
    setLoading(true);
    setTestResult('Testing cart API...');

    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      setTestResult('❌ Please login first to test cart API');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/cart/getCartByUserEmail/${userEmail}`);
      setTestResult(`✅ Cart API working! Cart items: ${response.data.items?.length || 0}`);
    } catch (error) {
      console.error('Cart API test error:', error);
      setTestResult(`❌ Cart API error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = () => {
    // Set a test user for development
    localStorage.setItem('email', 'test@example.com');
    localStorage.setItem('role', 'USER');
    setTestResult('✅ Test user logged in: test@example.com');
  };

  const logout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setTestResult('✅ Logged out');
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5>Backend Connection Test</h5>
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 mb-3 flex-wrap">
            <button
              className="btn btn-primary"
              onClick={testBackendConnection}
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Backend'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={testCartAPI}
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Cart API'}
            </button>
            <button
              className="btn btn-success"
              onClick={quickLogin}
              disabled={loading}
            >
              Quick Login
            </button>
            <button
              className="btn btn-warning"
              onClick={logout}
              disabled={loading}
            >
              Logout
            </button>
          </div>
          
          {testResult && (
            <div className="alert alert-info">
              <pre>{testResult}</pre>
            </div>
          )}
          
          <div className="mt-3">
            <h6>Debug Info:</h6>
            <ul>
              <li>Frontend URL: {window.location.origin}</li>
              <li>User Email: {localStorage.getItem('email') || 'Not logged in'}</li>
              <li>User Role: {localStorage.getItem('role') || 'Not set'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendTest;
