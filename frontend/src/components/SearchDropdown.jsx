import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './SearchDropdown.css';

const baseUrl = 'http://localhost:8080';

function SearchDropdown() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Debounce search
    const debounceTimeout = useRef(null);

    const searchProducts = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/products/search`, {
                params: { q: searchQuery }
            });
            setResults(response.data.slice(0, 8)); // Limit to 8 results
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (query.trim()) {
            setIsLoading(true);
            debounceTimeout.current = setTimeout(() => {
                searchProducts(query);
            }, 300);
        } else {
            setResults([]);
            setIsLoading(false);
        }

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [query, searchProducts]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setIsOpen(true);
        setActiveIndex(-1);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleSelectProduct = (product) => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        navigate(`/products/${product.modelNo}`);
    };

    const handleKeyDown = (e) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < results.length) {
                    handleSelectProduct(results[activeIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);

    return (
        <div className="search-dropdown-container" ref={containerRef}>
            <div className="search-input-wrapper">
                <FaSearch className="search-icon" size={14} />
                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                {query && (
                    <button className="clear-btn" onClick={handleClear}>
                        <FaTimes size={14} />
                    </button>
                )}
            </div>

            {isOpen && (query.trim() || isLoading) && (
                <div className="search-dropdown">
                    {isLoading ? (
                        <div className="search-loading">
                            <div className="spinner" />
                            <span>Searching...</span>
                        </div>
                    ) : results.length > 0 ? (
                        results.map((product, index) => (
                            <div
                                key={product.modelNo}
                                className={`search-result-item ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => handleSelectProduct(product)}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <img
                                    src={product.img1 || 'https://via.placeholder.com/50'}
                                    alt={product.name}
                                    className="result-image"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                                />
                                <div className="result-info">
                                    <p className="result-name">{product.name}</p>
                                    <p className="result-category">
                                        {product.category} • {product.subCategory}
                                    </p>
                                </div>
                                <span className="result-price">{formatPrice(product.price)}</span>
                            </div>
                        ))
                    ) : (
                        <div className="search-no-results">
                            No products found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchDropdown;
