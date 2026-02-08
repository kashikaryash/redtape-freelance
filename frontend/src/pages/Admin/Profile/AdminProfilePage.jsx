import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
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
    FaCheck,
    FaUserShield,
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import PhoneInput from '../../../components/PhoneInput/PhoneInput';
import ProfileHeader from '../../../components/ProfileHeader';

const API_URL = 'http://localhost:8080/api';

function AdminProfilePage() {
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
    const [changingPassword, setChangingPassword] = useState(false);

    // Profile picture state
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [pictureTimestamp, setPictureTimestamp] = useState(Date.now());

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

    useEffect(() => {
        if (user && profile.hasProfilePicture) {
            fetchProfileImage();
        }
    }, [user, profile.hasProfilePicture, pictureTimestamp]);

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
            showMessage('success', 'Picture updated!');
        } catch (error) {
            console.error('Error uploading picture:', error);
            showMessage('error', 'Failed to upload picture');
        } finally {
            setUploadingPicture(false);
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
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <ProfileHeader />

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Header Section */}
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div>
                                <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>Admin Profile</h2>
                                <p className="text-muted mb-0">Manage your administrative account details</p>
                            </div>
                            <span className="badge bg-danger px-3 py-2 fs-6">
                                <FaUserShield className="me-2" />
                                {user.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'Moderator'}
                            </span>
                        </div>

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

                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                            <div className="card-body p-0">
                                <div className="row g-0">
                                    {/* Sidebar / Picture Column */}
                                    <div className="col-md-4 bg-light d-flex flex-column align-items-center justify-content-center p-4 border-end">
                                        <div className="position-relative mb-3">
                                            <div
                                                className="rounded-circle overflow-hidden border border-3 border-white shadow"
                                                style={{ width: '120px', height: '120px', backgroundColor: '#e9ecef' }}
                                            >
                                                {profileImageUrl ? (
                                                    <img src={profileImageUrl} alt="Profile" className="w-100 h-100 object-fit-cover" />
                                                ) : (
                                                    <div className="d-flex align-items-center justify-content-center h-100 text-secondary">
                                                        <FaUser size={40} />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                className="btn btn-sm btn-danger position-absolute bottom-0 end-0 rounded-circle shadow-sm"
                                                style={{ width: '32px', height: '32px', padding: 0 }}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                {uploadingPicture ? (
                                                    <span className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }} />
                                                ) : (
                                                    <FaCamera size={12} />
                                                )}
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handlePictureUpload}
                                                hidden
                                                accept="image/*"
                                            />
                                        </div>
                                        <h5 className="fw-bold mb-1">{profile.name}</h5>
                                        <p className="text-muted small mb-3">{profile.email}</p>
                                        <div className="d-grid gap-2 w-100">
                                            <button
                                                className="btn btn-outline-dark btn-sm"
                                                onClick={() => setShowPasswordModal(true)}
                                            >
                                                <FaLock className="me-2" /> Change Password
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => {
                                                    logout();
                                                    navigate('/login');
                                                }}
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>

                                    {/* Details Column */}
                                    <div className="col-md-8 p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h5 className="mb-0 fw-bold">Account Details</h5>
                                            {!editing && (
                                                <button
                                                    className="btn btn-link text-danger text-decoration-none p-0 fw-semibold"
                                                    onClick={() => setEditing(true)}
                                                >
                                                    <FaEdit className="me-1" /> Edit Details
                                                </button>
                                            )}
                                        </div>

                                        {editing ? (
                                            <form onSubmit={handleEditSubmit}>
                                                <div className="mb-3">
                                                    <label className="form-label small text-muted fw-bold">FULL NAME</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editForm.name || ''}
                                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label small text-muted fw-bold">PHONE</label>
                                                    <PhoneInput
                                                        value={editForm.mobile || ''}
                                                        onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label small text-muted fw-bold">GENDER</label>
                                                    <select
                                                        className="form-select"
                                                        value={editForm.gender || ''}
                                                        onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button type="submit" className="btn btn-danger text-white px-4" disabled={saving}>
                                                        {saving ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-light px-4"
                                                        onClick={() => {
                                                            setEditing(false);
                                                            setEditForm(profile);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="row g-4">
                                                <div className="col-6">
                                                    <label className="small text-muted fw-bold d-block mb-1">EMAIL</label>
                                                    <span className="fw-medium">{profile.email}</span>
                                                </div>
                                                <div className="col-6">
                                                    <label className="small text-muted fw-bold d-block mb-1">PHONE</label>
                                                    <span className="fw-medium">{profile.mobile ? `+92 ${profile.mobile}` : '-'}</span>
                                                </div>
                                                <div className="col-6">
                                                    <label className="small text-muted fw-bold d-block mb-1">GENDER</label>
                                                    <span className="fw-medium">{profile.gender || '-'}</span>
                                                </div>
                                                <div className="col-6">
                                                    <label className="small text-muted fw-bold d-block mb-1">ROLE</label>
                                                    <span className="fw-medium text-danger">{profile.role}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Modal (Simplified for brevity, similar to existing) */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content rounded-4 border-0">
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">Change Password</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handlePasswordChange}>
                                        <div className="mb-3">
                                            <label className="form-label">Current Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={passwordForm.currentPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={passwordForm.newPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                required minLength={6}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label">Confirm Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={passwordForm.confirmPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="d-flex justify-content-end gap-2">
                                            <button type="button" className="btn btn-light" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                            <button type="submit" className="btn btn-danger text-white">Update Password</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminProfilePage;
