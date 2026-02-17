import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../../ProductCard/ProductCard';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../../../context/CartContext';
import Navbar from '../../../components/Navbar';

const baseUrl = 'https://steadfast-rejoicing-production.up.railway.app';

function CatsAndSubCats() {
  const { cat, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  // Removed the unused loading state

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products/category/${cat}/${subcategory}`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, [cat, subcategory]);

  const handleAddToCart = async (product) => {
    console.log("Add to cart clicked for:", product);
    const userEmail = localStorage.getItem('email');
    console.log("User email:", userEmail);

    if (!userEmail) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product, 1);
      console.log("Successfully added to cart via CartContext");
    } catch (error) {
      console.error('Error updating cart:', error);
      console.error('Error response:', error.response?.data); // 👈 This logs the backend's error message
      toast.error('Failed to add product to cart', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5" style={{ marginTop: '80px' }}>
        <h2 className="text-center text-uppercase fw-bold mb-5">
          {cat} / {subcategory}
        </h2>

        <div className="row">
          {/* Optional sidebar placeholder */}
          {/* <div className="col-md-3">Sidebar here if needed</div> */}

          <div className="col-md-12">
            {products.length > 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {products.map((product) => (
                  <motion.div
                    key={product.modelNo}
                    className="col"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard
                      product={product}
                      onViewDetails={() => navigate(`/products/${product.modelNo}`)}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">No products found in this category/subcategory.</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content rounded-4 shadow">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedProduct.name}</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedProduct(null)} />
                </div>
                <div className="modal-body">
                  <img
                    src={selectedProduct.img1}
                    alt={selectedProduct.name}
                    className="img-fluid rounded mb-3"
                  />
                  <p><strong>Description:</strong> {selectedProduct.description}</p>
                  <p><strong>Price:</strong> ₹ {selectedProduct.price}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CatsAndSubCats;
