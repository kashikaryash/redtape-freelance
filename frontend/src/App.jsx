import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './components/ToastManager';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';

// Public Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import AllProducts from './pages/User/AllProducts/AllProducts';
import CatsAndSubCats from './pages/User/catsubcat/CatsAndSubCats';
import ProductDetailPage from './pages/User/catsubcat/ProductDetailPage';
import CartPage from './pages/User/Cart/CartPage';
import CheckoutPage from './pages/User/Checkout/CheckoutPage';
import MyOrdersPage from './pages/User/Orders/MyOrdersPage';
import WishlistPage from './pages/User/Wishlist/WishlistPage';
import SavedAddressesPage from './pages/User/Addresses/SavedAddressesPage';
import MyProfilePage from './pages/User/Profile/MyProfilePage';
import { WishlistProvider } from './context/WishlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';

// Admin Pages
import AdminHome from './pages/Admin/AdminHome/AdminHome';
import AddProductForm from './pages/Admin/AddProduct/AddProductForm';
import ShowAllProducts from './pages/Admin/ShowAllProducts/ShowAllProducts';
import ShowAllCustomers from './pages/Admin/ShowAllCustomers/ShowAllCustomer';
import AnalyticsPage from './pages/Admin/Analytics/AnalyticsPage';
import ReviewsPage from './pages/Admin/Reviews/ReviewsPage';
import OrdersPage from './pages/Admin/Orders/OrdersPage';
import InventoryPage from './pages/Admin/Inventory/InventoryPage';
import ModeratorHome from './pages/Moderator/ModeratorHome';
import AdminProfilePage from './pages/Admin/Profile/AdminProfilePage';
import AdminCouponPage from './pages/Admin/AdminCouponPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e63946',
    },
    secondary: {
      main: '#7c3aed',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && (!user.roles || !allowedRoles.some(role => user.roles.includes(role)))) {
    // If admin is accessed by mod, or mod accessed by admin (though mod accesses are usually superset)
    // Actually, usually we have separate homes.
    const isAdmin = user.roles?.includes('ROLE_ADMIN');
    const isMod = user.roles?.includes('ROLE_MODERATOR');

    if (isAdmin) {
      return <Navigate to="/adminHome" replace />;
    } else if (isMod) {
      return <Navigate to="/moderatorHome" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/products" element={<AllProducts />} />
      <Route path="/products/:modelNo" element={<ProductDetailPage />} />
      <Route path="/cat/:cat/:subcategory" element={<CatsAndSubCats />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/my-orders" element={<MyOrdersPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/my-addresses" element={<SavedAddressesPage />} />
      <Route path="/my-profile" element={<MyProfilePage />} />

      {/* Admin Routes - Protected for ADMIN only */}
      <Route
        path="/adminHome"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-product"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']}>
            <AddProductForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']}>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']}>
            <ShowAllProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <ShowAllCustomers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']}>
            <ReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/inventory"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']}>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']}>
            <AdminProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/coupons"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminCouponPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/moderatorHome"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MODERATOR']}>
            <ModeratorHome />
          </ProtectedRoute>
        }
      />

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <Router>
                  <ToastProvider>
                    <AppRoutes />
                  </ToastProvider>
                </Router>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;
