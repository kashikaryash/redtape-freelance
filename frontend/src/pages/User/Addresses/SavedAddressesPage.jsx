import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaMapMarkerAlt,
    FaPlus,
    FaEdit,
    FaTrash,
    FaCheck,
    FaTimes,
    FaHome,
    FaBriefcase,
    FaEllipsisH,
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import PhoneInput from '../../../components/PhoneInput/PhoneInput';

const API_URL = 'https://steadfast-rejoicing-production.up.railway.app/api';

function SavedAddressesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        label: 'Home',
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
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
            setLoading(true);
            const response = await axios.get(`${API_URL}/addresses`);
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Invalid phone number (7-15 digits)';
        }

        if (!formData.addressLine.trim()) {
            newErrors.addressLine = 'Address is required';
        } else if (formData.addressLine.length < 10) {
            newErrors.addressLine = 'Address must be at least 10 characters';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Pincode must be 6 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        try {
            if (editingAddress) {
                await axios.put(`${API_URL}/addresses/${editingAddress.id}`, formData);
            } else {
                await axios.post(`${API_URL}/addresses`, formData);
            }
            await fetchAddresses();
            closeModal();
        } catch (error) {
            console.error('Error saving address:', error);
            alert(error.response?.data?.message || 'Failed to save address');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        try {
            await axios.delete(`${API_URL}/addresses/${id}`);
            await fetchAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete address');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await axios.put(`${API_URL}/addresses/${id}/default`);
            await fetchAddresses();
        } catch (error) {
            console.error('Error setting default:', error);
        }
    };

    const openAddModal = () => {
        setEditingAddress(null);
        setFormData({
            label: 'Home',
            fullName: user?.name || '',
            phone: '',
            addressLine: '',
            city: '',
            state: '',
            pincode: '',
            isDefault: addresses.length === 0,
        });
        setErrors({});
        setShowModal(true);
    };

    const openEditModal = (address) => {
        setEditingAddress(address);
        setFormData({
            label: address.label || 'Home',
            fullName: address.fullName,
            phone: address.phone,
            addressLine: address.addressLine,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            isDefault: address.isDefault,
        });
        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAddress(null);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const getLabelIcon = (label) => {
        switch (label) {
            case 'Home':
                return <FaHome />;
            case 'Work':
                return <FaBriefcase />;
            default:
                return <FaEllipsisH />;
        }
    };

    if (!user) return null;

    return (
        <>
            <Navbar />
            <div className="container" style={{ marginTop: '100px', marginBottom: '40px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1">Saved Addresses</h2>
                        <p className="text-muted mb-0">Manage your delivery addresses</p>
                    </div>
                    <button className="btn btn-danger" onClick={openAddModal}>
                        <FaPlus className="me-2" />
                        Add New Address
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-5">
                        <FaMapMarkerAlt size={80} className="text-muted mb-4" />
                        <h4>No saved addresses</h4>
                        <p className="text-muted">Add an address for faster checkout</p>
                        <button className="btn btn-danger mt-3" onClick={openAddModal}>
                            <FaPlus className="me-2" />
                            Add Your First Address
                        </button>
                    </div>
                ) : (
                    <div className="row">
                        {addresses.map((address) => (
                            <motion.div
                                key={address.id}
                                className="col-md-6 col-lg-4 mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div
                                    className={`card h-100 ${address.isDefault ? 'border-danger' : ''}`}
                                    style={{
                                        borderWidth: address.isDefault ? '2px' : '1px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center">
                                                <span
                                                    className="badge bg-light text-dark me-2"
                                                    style={{ fontSize: '0.9rem' }}
                                                >
                                                    {getLabelIcon(address.label)}
                                                    <span className="ms-1">{address.label || 'Other'}</span>
                                                </span>
                                                {address.isDefault && (
                                                    <span className="badge bg-danger">Default</span>
                                                )}
                                            </div>
                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-sm btn-light"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                >
                                                    <FaEllipsisH />
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end">
                                                    <li>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={() => openEditModal(address)}
                                                        >
                                                            <FaEdit className="me-2" />
                                                            Edit
                                                        </button>
                                                    </li>
                                                    {!address.isDefault && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleSetDefault(address.id)}
                                                            >
                                                                <FaCheck className="me-2" />
                                                                Set as Default
                                                            </button>
                                                        </li>
                                                    )}
                                                    <li>
                                                        <hr className="dropdown-divider" />
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item text-danger"
                                                            onClick={() => handleDelete(address.id)}
                                                        >
                                                            <FaTrash className="me-2" />
                                                            Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <h6 className="fw-bold mb-2">{address.fullName}</h6>
                                        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                                            {address.addressLine}
                                            <br />
                                            {address.city}, {address.state} - {address.pincode}
                                        </p>
                                        <p className="mb-0">
                                            <small className="text-muted">📞 +92 {address.phone}</small>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className="modal-dialog modal-lg modal-dialog-centered"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title">
                                        <FaMapMarkerAlt className="me-2" />
                                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={closeModal}
                                    ></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="row g-3">
                                            {/* Label Selection */}
                                            <div className="col-12">
                                                <label className="form-label">Address Type</label>
                                                <div className="btn-group w-100" role="group">
                                                    {['Home', 'Work', 'Other'].map((label) => (
                                                        <button
                                                            key={label}
                                                            type="button"
                                                            className={`btn ${formData.label === label
                                                                ? 'btn-danger'
                                                                : 'btn-outline-secondary'
                                                                }`}
                                                            onClick={() =>
                                                                setFormData((prev) => ({ ...prev, label }))
                                                            }
                                                        >
                                                            {getLabelIcon(label)}
                                                            <span className="ms-2">{label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Full Name *</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                />
                                                {errors.fullName && (
                                                    <div className="invalid-feedback">{errors.fullName}</div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label">Phone *</label>
                                                <PhoneInput
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    error={errors.phone}
                                                    name="phone"
                                                    defaultCountry="PK"
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label">Address *</label>
                                                <textarea
                                                    className={`form-control ${errors.addressLine ? 'is-invalid' : ''}`}
                                                    name="addressLine"
                                                    rows="2"
                                                    placeholder="House no, Street, Locality"
                                                    value={formData.addressLine}
                                                    onChange={handleChange}
                                                ></textarea>
                                                {errors.addressLine && (
                                                    <div className="invalid-feedback">{errors.addressLine}</div>
                                                )}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">City *</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                />
                                                {errors.city && (
                                                    <div className="invalid-feedback">{errors.city}</div>
                                                )}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">State *</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                />
                                                {errors.state && (
                                                    <div className="invalid-feedback">{errors.state}</div>
                                                )}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Pincode *</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                                                    name="pincode"
                                                    maxLength="6"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                />
                                                {errors.pincode && (
                                                    <div className="invalid-feedback">{errors.pincode}</div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="isDefault"
                                                        name="isDefault"
                                                        checked={formData.isDefault}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="isDefault">
                                                        Set as default address
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-danger" disabled={saving}>
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheck className="me-2" />
                                                    {editingAddress ? 'Update Address' : 'Save Address'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default SavedAddressesPage;
