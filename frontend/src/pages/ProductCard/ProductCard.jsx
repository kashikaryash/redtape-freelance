import React, { useState } from 'react';
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useRecentlyViewed } from "../../context/RecentlyViewedContext";
import { motion } from 'framer-motion';
import { FaShoppingCart, FaEye, FaHeart } from 'react-icons/fa';

function ProductCard({ product, onViewDetails }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, cart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Check if item is in cart using the cart state
  const isInCart = cart?.items?.some(item => item.product?.modelNo === product.modelNo) || false;

  const handleAddToCart = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await addToCart(String(product.modelNo), 1);
    } catch (error) {
      console.error('🛑 Cart operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => setImageError(true);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  // Helper to get image URL (supports both binary storage and legacy URLs)
  const getImageUrl = (imageNum = 1) => {
    const legacyUrl = product[`img${imageNum}`];
    // If legacy URL exists and is not empty, use it; otherwise use binary endpoint
    if (legacyUrl && legacyUrl.trim() !== '') {
      return legacyUrl;
    }
    return `https://steadfast-rejoicing-production.up.railway.app/api/images/product/${product.modelNo}/${imageNum}`;
  };

  return (
    <motion.div
      className="card h-100 shadow-sm position-relative overflow-hidden"
      whileHover={{ y: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Discount Badge */}
      {product.discount && (
        <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded-end" style={{ zIndex: 2 }}>
          <small className="fw-bold">{product.discount}% OFF</small>
        </div>
      )}

      {/* Stock Status Badge */}
      {product.quantity === 0 && (
        <div className="position-absolute" style={{ top: '10px', left: '10px', zIndex: 3 }}>
          <span className="badge bg-dark" style={{ fontSize: '0.75rem' }}>
            Out of Stock
          </span>
        </div>
      )}
      {product.quantity > 0 && product.quantity <= (product.lowStockThreshold || 5) && (
        <div className="position-absolute" style={{ top: '10px', left: '10px', zIndex: 3 }}>
          <span className="badge bg-warning text-dark" style={{ fontSize: '0.75rem' }}>
            Only {product.quantity} left!
          </span>
        </div>
      )}

      {/* Cart Badge */}
      {isInCart && (
        <div className="position-absolute" style={{ top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
          <span className="badge bg-success rounded-pill">
            In cart
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      {/* Wishlist Button */}
      <button
        className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle p-2 shadow-sm"
        style={{ zIndex: 2, width: '40px', height: '40px' }}
        onClick={async (e) => {
          e.stopPropagation();
          if (!isInWishlist(product.modelNo)) {
            await addToWishlist(product.modelNo);
          } else {
            await removeFromWishlist(product.modelNo);
          }
        }}
      >
        <FaHeart
          className={isInWishlist(product.modelNo) ? "text-danger" : "text-muted"}
          size={18}
        />
      </button>

      {/* Product Image */}
      <div className="position-relative overflow-hidden" style={{ height: '350px' }}>
        {!imageError ? (
          <img
            src={getImageUrl(1)}
            className="card-img-top w-100 h-100"
            alt={product.name}
            style={{ objectFit: 'contain', transition: 'transform 0.3s ease' }}
            onError={handleImageError}
            onMouseEnter={(e) => {
              if (isHovered) e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 bg-light">
            <div className="text-center text-muted">
              <FaShoppingCart size={50} className="mb-2" />
              <p>Image not available</p>
            </div>
          </div>
        )}

        {/* Quick Action Overlay */}
        <motion.div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: 'rgba(0,0,0,0.7)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <button
            className="btn btn-light me-2 rounded-circle"
            onClick={(e) => {
              e.stopPropagation();
              addToRecentlyViewed(product);
              onViewDetails();
            }}
            style={{ width: '50px', height: '50px' }}
          >
            <FaEye />
          </button>
          <button
            className={`btn rounded-circle ${isInCart ? 'btn-success' : 'btn-primary'}`}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isLoading || isInCart}
            style={{ width: '50px', height: '50px' }}
          >
            {isLoading ? (
              <div className="spinner-border spinner-border-sm text-white" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <FaShoppingCart />
            )}
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate" title={product.name}>
          {product.name}
        </h5>
        <p className="card-text text-muted small text-truncate" title={product.description}>
          {product.description}
        </p>

        {/* Pricing */}
        <div className="mb-3 d-flex align-items-center gap-2">
          <span className="h5 text-success fw-bold mb-0">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-muted text-decoration-line-through small">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="badge bg-danger">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto d-grid gap-2">
          <button
            className={`btn ${product.quantity === 0 ? 'btn-secondary' : isInCart ? 'btn-success' : 'btn-danger'}`}
            onClick={handleAddToCart}
            disabled={isLoading || isInCart || product.quantity === 0}
          >
            {product.quantity === 0 ? (
              <>Out of Stock</>
            ) : isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : isInCart ? (
              <>
                <FaShoppingCart className="me-2" />
                Added to Cart
              </>
            ) : (
              <>
                <FaShoppingCart className="me-2" />
                Add to Cart
              </>
            )}
          </button>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              addToRecentlyViewed(product);
              onViewDetails();
            }}
          >
            <FaEye className="me-1" />
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
