import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ProfileHeader from '../../../components/ProfileHeader';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCamera,
    FaLock,
    FaEdit,
    FaSave,
    FaTimes,
    FaEye,
    FaEyeSlash,
    FaCheck,
    FaMapMarkerAlt,
    FaTransgender,
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import PhoneInput from '../../../components/PhoneInput/PhoneInput';

const API_URL = 'https://steadfast-rejoicing-production.up.railway.app/api';

function MyProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        mobile: '',
        gender: '',
        role: '',
        hasProfilePicture: false,
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Password change state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [changingPassword, setChangingPassword] = useState(false);

    // Profile picture state
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [pictureTimestamp, setPictureTimestamp] = useState(Date.now());

    useEffect(() => {
        if (user && profile.hasProfilePicture) {
            fetchProfileImage();
        }
    }, [user, profile.hasProfilePicture, pictureTimestamp]);

    const fetchProfileImage = async () => {
        try {
            const response = await axios.get(`${API_URL}/profile/picture`, {
                headers: getAuthHeaders(),
                responseType: 'blob'
            });
            const url = URL.createObjectURL(response.data);
            setProfileImageUrl(url);
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };

    const getAuthHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [user, navigate]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/profile`, {
                headers: getAuthHeaders(),
            });
            setProfile(response.data);
            setEditForm(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            showMessage('error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`${API_URL}/profile`, editForm, {
                headers: getAuthHeaders(),
            });
            setProfile({ ...profile, ...editForm });
            setEditing(false);
            showMessage('success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('error', error.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePictureClick = () => {
        fileInputRef.current?.click();
    };

    const handlePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showMessage('error', 'Image size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploadingPicture(true);
        try {
            await axios.post(`${API_URL}/profile/picture`, formData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPictureTimestamp(Date.now());
            setProfile({ ...profile, hasProfilePicture: true });
            showMessage('success', 'Profile picture updated!');
        } catch (error) {
            console.error('Error uploading picture:', error);
            showMessage('error', 'Failed to upload profile picture');
        } finally {
            setUploadingPicture(false);
        }
    };

    const handleDeletePicture = async () => {
        if (!window.confirm('Delete your profile picture?')) return;

        try {
            await axios.delete(`${API_URL}/profile/picture`, {
                headers: getAuthHeaders(),
            });
            setProfile({ ...profile, hasProfilePicture: false });
            showMessage('success', 'Profile picture removed');
        } catch (error) {
            console.error('Error deleting picture:', error);
            showMessage('error', 'Failed to delete picture');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showMessage('error', 'New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters');
            return;
        }

        setChangingPassword(true);
        try {
            await axios.post(`${API_URL}/profile/change-password`, passwordForm, {
                headers: getAuthHeaders(),
            });
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showMessage('success', 'Password changed successfully!');
        } catch (error) {
            console.error('Error changing password:', error);
            showMessage('error', error.response?.data?.error || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    if (!user) return null;

    return (
        <>
            <ProfileHeader />
            <div
                className="min-vh-100"
                style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    paddingTop: '100px',
                    paddingBottom: '40px',
                }}
            >
                <div className="container">
                    {/* Message Alert */}
                    <AnimatePresence>
                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`}
                            >
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            {/* Profile Header Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card mb-4"
                                style={{
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                }}
                            >
                                {/* Header Background */}
                                <div
                                    style={{
                                        background: 'linear-gradient(135deg, #e63946 0%, #d62839 100%)',
                                        height: '150px',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Profile Picture */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '-60px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '140px',
                                                height: '140px',
                                                borderRadius: '50%',
                                                border: '5px solid white',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                backgroundColor: '#f0f0f0',
                                                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                                            }}
                                        >
                                            {loading ? (
                                                <div className="d-flex align-items-center justify-content-center h-100">
                                                    <div className="spinner-border text-secondary" />
                                                </div>
                                            ) : profile.hasProfilePicture ? (
                                                <img
                                                    src={profileImageUrl}
                                                    alt="Profile"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="d-flex align-items-center justify-content-center h-100">
                                                    <FaUser size={50} className="text-secondary" />
                                                </div>
                                            )}

                                            {/* Camera Overlay */}
                                            <div
                                                onClick={handlePictureClick}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '40px',
                                                    background: 'rgba(0,0,0,0.6)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {uploadingPicture ? (
                                                    <div className="spinner-border spinner-border-sm text-white" />
                                                ) : (
                                                    <FaCamera className="text-white" size={18} />
                                                )}
                                            </div>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePictureUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="card-body text-center" style={{ paddingTop: '80px' }}>
                                    {loading ? (
                                        <div className="py-4">
                                            <div className="spinner-border text-danger" />
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="mb-1 fw-bold">{profile.name || 'User'}</h3>
                                            <p className="text-muted mb-2">{profile.email}</p>
                                            <span className="badge bg-danger px-3 py-2">{profile.role}</span>

                                            {profile.hasProfilePicture && (
                                                <div className="mt-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={handleDeletePicture}
                                                    >
                                                        Remove Picture
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>

                            {/* Profile Details Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="card mb-4"
                                style={{ borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
                            >
                                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                                    <h5 className="mb-0 fw-bold">
                                        <FaUser className="me-2 text-danger" />
                                        Personal Information
                                    </h5>
                                    {!editing && (
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => setEditing(true)}
                                        >
                                            <FaEdit className="me-1" /> Edit
                                        </button>
                                    )}
                                </div>
                                <div className="card-body">
                                    {editing ? (
                                        <form onSubmit={handleEditSubmit}>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Full Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editForm.name || ''}
                                                        onChange={(e) =>
                                                            setEditForm({ ...editForm, name: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Phone Number</label>
                                                    <PhoneInput
                                                        value={editForm.mobile || ''}
                                                        onChange={(e) =>
                                                            setEditForm({ ...editForm, mobile: e.target.value })
                                                        }
                                                        name="mobile"
                                                        defaultCountry="PK"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Gender</label>
                                                    <select
                                                        className="form-select"
                                                        value={editForm.gender || ''}
                                                        onChange={(e) =>
                                                            setEditForm({ ...editForm, gender: e.target.value })
                                                        }
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="col-12 mt-4">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-danger me-2"
                                                        disabled={saving}
                                                    >
                                                        {saving ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaSave className="me-1" /> Save Changes
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => {
                                                            setEditing(false);
                                                            setEditForm(profile);
                                                        }}
                                                    >
                                                        <FaTimes className="me-1" /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                        style={{
                                                            width: '45px',
                                                            height: '45px',
                                                            background: 'rgba(230,57,70,0.1)',
                                                        }}
                                                    >
                                                        <FaUser className="text-danger" />
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Full Name</small>
                                                        <p className="mb-0 fw-semibold">{profile.name || '—'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                        style={{
                                                            width: '45px',
                                                            height: '45px',
                                                            background: 'rgba(230,57,70,0.1)',
                                                        }}
                                                    >
                                                        <FaEnvelope className="text-danger" />
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Email</small>
                                                        <p className="mb-0 fw-semibold">{profile.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                        style={{
                                                            width: '45px',
                                                            height: '45px',
                                                            background: 'rgba(230,57,70,0.1)',
                                                        }}
                                                    >
                                                        <FaPhone className="text-danger" />
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Phone</small>
                                                        <p className="mb-0 fw-semibold">
                                                            {profile.mobile ? `+92 ${profile.mobile}` : '—'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                        style={{
                                                            width: '45px',
                                                            height: '45px',
                                                            background: 'rgba(230,57,70,0.1)',
                                                        }}
                                                    >
                                                        <FaTransgender className="text-danger" />
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Gender</small>
                                                        <p className="mb-0 fw-semibold">{profile.gender || '—'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Quick Actions Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="card"
                                style={{ borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
                            >
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0 fw-bold">
                                        <FaLock className="me-2 text-danger" />
                                        Account Settings
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <button
                                                className="btn btn-outline-danger w-100 py-3"
                                                onClick={() => setShowPasswordModal(true)}
                                            >
                                                <FaLock className="me-2" />
                                                Change Password
                                            </button>
                                        </div>
                                        <div className="col-md-4">
                                            <button
                                                className="btn btn-outline-primary w-100 py-3"
                                                onClick={() => navigate('/addresses')}
                                            >
                                                <FaMapMarkerAlt className="me-2" />
                                                Manage Addresses
                                            </button>
                                        </div>
                                        <div className="col-md-4">
                                            <button
                                                className="btn btn-outline-dark w-100 py-3"
                                                onClick={() => {
                                                    logout();
                                                    navigate('/login', { replace: true });
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPasswordModal(false)}
                    >
                        <motion.div
                            className="modal-dialog modal-dialog-centered"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content" style={{ borderRadius: '16px' }}>
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title">
                                        <FaLock className="me-2" />
                                        Change Password
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowPasswordModal(false)}
                                    />
                                </div>
                                <form onSubmit={handlePasswordChange}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Current Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPasswords.current ? 'text' : 'password'}
                                                    className="form-control"
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({
                                                            ...passwordForm,
                                                            currentPassword: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() =>
                                                        setShowPasswords({
                                                            ...showPasswords,
                                                            current: !showPasswords.current,
                                                        })
                                                    }
                                                >
                                                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">New Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPasswords.new ? 'text' : 'password'}
                                                    className="form-control"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({
                                                            ...passwordForm,
                                                            newPassword: e.target.value,
                                                        })
                                                    }
                                                    required
                                                    minLength={6}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() =>
                                                        setShowPasswords({
                                                            ...showPasswords,
                                                            new: !showPasswords.new,
                                                        })
                                                    }
                                                >
                                                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Confirm New Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPasswords.confirm ? 'text' : 'password'}
                                                    className="form-control"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({
                                                            ...passwordForm,
                                                            confirmPassword: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() =>
                                                        setShowPasswords({
                                                            ...showPasswords,
                                                            confirm: !showPasswords.confirm,
                                                        })
                                                    }
                                                >
                                                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowPasswordModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-danger"
                                            disabled={changingPassword}
                                        >
                                            {changingPassword ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Changing...
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheck className="me-1" /> Change Password
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

export default MyProfilePage;
