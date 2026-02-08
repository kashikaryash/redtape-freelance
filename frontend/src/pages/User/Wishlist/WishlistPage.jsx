import React, { useEffect } from 'react';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import ProductCard from '../../ProductCard/ProductCard';
import { FaHeart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function WishlistPage() {
    const { wishlist, loading } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: '100px', marginBottom: '40px' }}>
                <h2 className="mb-4">My Wishlist</h2>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : wishlist.items?.length === 0 ? (
                    <div className="text-center py-5">
                        <FaHeart size={80} className="text-muted mb-4" />
                        <h4>Your wishlist is empty</h4>
                        <p className="text-muted">Save items you love to your wishlist.</p>
                        <button
                            className="btn btn-danger mt-3"
                            onClick={() => navigate('/all-products')}
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="row">
                        {wishlist.items?.map((item) => (
                            <div key={item.id} className="col-12 col-md-4 col-lg-3 mb-4">
                                <ProductCard
                                    product={item.product}
                                    onViewDetails={() => navigate(`/products/${item.product.modelNo}`)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default WishlistPage;
