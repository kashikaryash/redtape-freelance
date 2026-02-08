import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '../../../components/Navbar';
import SimilarProducts from '../../../components/SimilarProducts';
import { FaStar, FaRegStar, FaUser } from 'react-icons/fa';

const baseUrl = 'http://localhost:8080';

function ProductDetailPage() {
  const { modelNo } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Helper to get image URL (supports both binary storage and legacy URLs)
  const getImageUrl = (imageNum = 1) => {
    if (!product) return '';
    const legacyUrl = product[`img${imageNum}`];
    if (legacyUrl && legacyUrl.trim() !== '') {
      return legacyUrl;
    }
    return `${baseUrl}/api/images/product/${product.modelNo}/${imageNum}`;
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/${modelNo}`)
      .then((res) => {
        setProduct(res.data);
        // Set main image using the helper pattern
        const img1 = res.data.img1;
        if (img1 && img1.trim() !== '') {
          setMainImage(img1);
        } else {
          setMainImage(`${baseUrl}/api/images/product/${res.data.modelNo}/1`);
        }
      })
      .catch((err) => console.error("Failed to fetch product:", err));

    // Fetch reviews
    fetchReviews();
  }, [modelNo]);

  const fetchReviews = async () => {
    setReviewLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/reviews/product/${modelNo}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.modelNo, 1);
      toast.success('Added to cart!');
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to proceed');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.modelNo, 1);
      navigate('/checkout');
    } catch (err) {
      console.error("Buy now failed:", err);
      toast.error('Failed to process your request');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation: Check if image
      if (!file.type.match('image.*')) {
        toast.error("Please upload an image file");
        return;
      }
      // Limit size to 2MB to prevent payload issues
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReview({ ...newReview, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to write a review');
      navigate('/login');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${baseUrl}/api/reviews`,
        {
          productModelNo: parseInt(modelNo),
          rating: newReview.rating,
          comment: newReview.comment,
          image: newReview.image // Include image in payload
        },
        { headers: getAuthHeaders() }
      );
      toast.success('Review submitted successfully!');
      setNewReview({ rating: 5, comment: '', image: null });
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error("Submit review failed:", err);
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, size = 18) => {
    return (
      <div className="d-flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{ cursor: interactive ? 'pointer' : 'default', color: 'var(--primary)' }}
            onClick={() => interactive && setNewReview({ ...newReview, rating: star })}
          >
            {star <= rating ? <FaStar size={size} /> : <FaRegStar size={size} />}
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container py-5" style={{ marginTop: '80px' }}>
        <div className="row g-5">

          {/* Left: Product Images */}
          <div className="col-md-6">
            <div className="border rounded shadow-sm p-3">
              <img src={mainImage} alt="Main" className="img-fluid rounded mb-3" />
              <div className="d-flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((num) => {
                  const imgUrl = getImageUrl(num);
                  return (
                    <img
                      key={num}
                      src={imgUrl}
                      alt={`View ${num}`}
                      className="img-thumbnail"
                      style={{ width: '75px', height: '75px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setMainImage(imgUrl)}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="col-md-6">
            <div className="border rounded shadow-sm p-4" style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}>
              <h2 className="mb-3">{product.name}</h2>
              <p className="text-muted mb-1"><strong>Brand:</strong> {product.brand}</p>
              <p className="text-muted mb-1"><strong>Color:</strong> {product.color}</p>
              <h4 className="text-danger mt-3 mb-2 fw-bold" style={{ fontSize: '2rem' }}>
                ₹{product.salePrice || product.price}
              </h4>
              {product.salePrice && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <p className="text-muted text-decoration-line-through mb-0">
                    ₹{product.price}
                  </p>
                  <span className="badge bg-warning text-dark">FLASH DEAL</span>
                </div>
              )}

              <p className="text-secondary mb-4">{product.description}</p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <button
                  className="btn btn-success btn-lg ms-2"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
                <button
                  className="btn btn-danger px-4"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <div className="d-flex flex-wrap align-items-center gap-2 mt-4">
                  <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Enter PIN code"
                  />
                  <button className="btn btn-dark">Check</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Recommendation Engine */}
        {product && <SimilarProducts currentProductId={product.modelNo} />}

        {/* Reviews Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="border rounded shadow-sm p-4" style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Ratings & Reviews</h3>
                {reviews.length > 0 && (
                  <div className="d-flex align-items-center gap-2">
                    <span className="h4 mb-0 text-warning">{averageRating}</span>
                    {renderStars(Math.round(averageRating))}
                    <span className="text-muted">({reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              {/* Write Review Form */}
              <div className="border rounded p-4 mb-4" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                <h5 className="mb-3">Write a Review</h5>
                {user ? (
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Your Rating</label>
                      <div>{renderStars(newReview.rating, true, 24)}</div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Your Review</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Share your experience with this product..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        maxLength={1000}
                        required
                      />
                      <small className="text-muted">{newReview.comment.length}/1000 characters</small>
                    </div>

                    {/* Image Upload */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Add a Photo (Optional)</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {newReview.image && (
                        <div className="mt-2">
                          <img src={newReview.image} alt="Preview" style={{ height: '80px', borderRadius: '8px' }} />
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-danger"
                            onClick={() => setNewReview({ ...newReview, image: null })}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-3">Please login to write a review</p>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/login')}
                    >
                      Login to Review
                    </button>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              {reviewLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-bottom py-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <FaUser />
                          </div>
                          <div>
                            <strong>{review.user?.name || 'Anonymous'}</strong>
                            <div>{renderStars(review.rating, false, 14)}</div>
                          </div>
                        </div>
                        <small className="text-muted">{formatDate(review.reviewDate)}</small>
                      </div>
                      <p className="mb-2 ms-5 ps-2">{review.comment}</p>
                      {/* Review Image */}
                      {review.image && (
                        <div className="ms-5 ps-2 mb-2">
                          <img
                            src={review.image}
                            alt="Review attachment"
                            className="img-thumbnail"
                            style={{ maxHeight: '150px', borderRadius: '8px', cursor: 'pointer' }}
                            onClick={() => window.open(review.image, '_blank')}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;
