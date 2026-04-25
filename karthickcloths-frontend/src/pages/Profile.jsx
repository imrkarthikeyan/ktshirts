import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = ({ isDark }) => {
    const navigate = useNavigate();
    const { user, logout, updateProfile, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        pincode: user?.pincode || '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            await updateProfile(formData);
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/');
        }
    };

    if (!user) {
        return (
            <div className={isDark ? "min-h-screen bg-black flex items-center justify-center pt-20" : "min-h-screen bg-zinc-50 flex items-center justify-center pt-20"}>
                <div className={isDark ? "text-white text-xl" : "text-zinc-900 text-xl"}>Loading...</div>
            </div>
        );
    }

    return (
        <div className={isDark ? "min-h-screen bg-black pt-20 pb-12 px-4 sm:px-6 lg:px-8" : "min-h-screen bg-zinc-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8"}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-12 animate-fade-up">
                    <h1 className={isDark ? "text-4xl sm:text-5xl font-black text-white mb-2" : "text-4xl sm:text-5xl font-black text-zinc-900 mb-2"}>
                        My Profile
                    </h1>
                    <p className={isDark ? "text-gray-400" : "text-zinc-600"}>Manage your personal information</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg animate-fade-up">
                        <p className="text-green-400 text-sm font-medium">✓ {successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg animate-fade-up">
                        <p className="text-red-400 text-sm font-medium">✗ {error}</p>
                    </div>
                )}

                {/* Profile Card */}
                <div className={isDark ? "bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8 animate-fade-up" : "bg-white border border-zinc-200 rounded-2xl p-8 mb-8 animate-fade-up"}>
                    {/* Profile Header */}
                    <div className={isDark ? "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-8 border-b border-gray-800" : "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-8 border-b border-zinc-200"}>
                        <div className="flex min-w-0 items-center gap-4">
                            <div className={isDark ? "w-16 h-16 bg-gradient-to-br from-white to-gray-400 rounded-full flex items-center justify-center" : "w-16 h-16 bg-gradient-to-br from-zinc-900 to-zinc-500 rounded-full flex items-center justify-center"}>
                                <span className={isDark ? "text-2xl font-black text-black" : "text-2xl font-black text-white"}>
                                    {user.fullName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <h2 className={isDark ? "truncate text-2xl font-bold text-white" : "truncate text-2xl font-bold text-zinc-900"}>{user.fullName}</h2>
                                <p className={isDark ? "truncate text-gray-400" : "truncate text-zinc-600"}>{user.email}</p>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className={isDark ? "w-full sm:w-auto px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all" : "w-full sm:w-auto px-6 py-2 bg-zinc-900 text-white font-bold rounded-lg hover:bg-black transition-all"}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Profile Form */}
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="fullName" className={isDark ? "block text-sm font-semibold text-gray-300 mb-2" : "block text-sm font-semibold text-zinc-700 mb-2"}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={isDark ? "w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all" : "w-full px-4 py-3 rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"}
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label htmlFor="phoneNumber" className={isDark ? "block text-sm font-semibold text-gray-300 mb-2" : "block text-sm font-semibold text-zinc-700 mb-2"}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={isDark ? "w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all" : "w-full px-4 py-3 rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"}
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="address" className={isDark ? "block text-sm font-semibold text-gray-300 mb-2" : "block text-sm font-semibold text-zinc-700 mb-2"}>
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className={isDark ? "w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all resize-none" : "w-full px-4 py-3 rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"}
                                />
                            </div>

                            {/* Pincode */}
                            <div>
                                <label htmlFor="pincode" className={isDark ? "block text-sm font-semibold text-gray-300 mb-2" : "block text-sm font-semibold text-zinc-700 mb-2"}>
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className={isDark ? "w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all" : "w-full px-4 py-3 rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={isDark ? "flex-1 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all" : "flex-1 px-6 py-3 bg-zinc-900 text-white font-bold rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            fullName: user.fullName,
                                            phoneNumber: user.phoneNumber,
                                            address: user.address,
                                            pincode: user.pincode,
                                        });
                                        setError(null);
                                    }}
                                    className={isDark ? "flex-1 px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-all" : "flex-1 px-6 py-3 bg-zinc-100 text-zinc-900 font-bold rounded-lg hover:bg-zinc-200 transition-all"}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Display Mode */
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={isDark ? "bg-gray-800 rounded-lg p-4" : "bg-zinc-100 rounded-lg p-4"}>
                                    <p className={isDark ? "text-gray-400 text-sm mb-1" : "text-zinc-600 text-sm mb-1"}>Full Name</p>
                                    <p className={isDark ? "text-white font-semibold" : "text-zinc-900 font-semibold"}>{user.fullName}</p>
                                </div>
                                <div className={isDark ? "bg-gray-800 rounded-lg p-4" : "bg-zinc-100 rounded-lg p-4"}>
                                    <p className={isDark ? "text-gray-400 text-sm mb-1" : "text-zinc-600 text-sm mb-1"}>Email</p>
                                    <p className={isDark ? "text-white font-semibold" : "text-zinc-900 font-semibold"}>{user.email}</p>
                                </div>
                                <div className={isDark ? "bg-gray-800 rounded-lg p-4" : "bg-zinc-100 rounded-lg p-4"}>
                                    <p className={isDark ? "text-gray-400 text-sm mb-1" : "text-zinc-600 text-sm mb-1"}>Phone Number</p>
                                    <p className={isDark ? "text-white font-semibold" : "text-zinc-900 font-semibold"}>{user.phoneNumber}</p>
                                </div>
                                <div className={isDark ? "bg-gray-800 rounded-lg p-4" : "bg-zinc-100 rounded-lg p-4"}>
                                    <p className={isDark ? "text-gray-400 text-sm mb-1" : "text-zinc-600 text-sm mb-1"}>Pincode</p>
                                    <p className={isDark ? "text-white font-semibold" : "text-zinc-900 font-semibold"}>{user.pincode}</p>
                                </div>
                            </div>
                            <div className={isDark ? "bg-gray-800 rounded-lg p-4" : "bg-zinc-100 rounded-lg p-4"}>
                                <p className={isDark ? "text-gray-400 text-sm mb-1" : "text-zinc-600 text-sm mb-1"}>Address</p>
                                <p className={isDark ? "text-white font-semibold" : "text-zinc-900 font-semibold"}>{user.address}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/cart')}
                        className={isDark ? "px-6 py-3 bg-gray-900 text-white font-bold rounded-lg border border-gray-800 hover:border-white transition-all transform hover:scale-105" : "px-6 py-3 bg-zinc-900 text-white font-bold rounded-lg border border-zinc-900 hover:bg-black transition-all transform hover:scale-105"}
                    >
                        View Cart
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-900/20 text-red-400 font-bold rounded-lg border border-red-800 hover:bg-red-900/40 transition-all"
                    >
                        Logout
                    </button>
                </div>

                {(user?.admin || user?.isAdmin) ? (
                    <div className={isDark ? "mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6" : "mt-8 bg-white border border-zinc-200 rounded-lg p-6"}>
                        <h3 className={isDark ? "text-white font-bold mb-4" : "text-zinc-900 font-bold mb-4"}>Admin Tools</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate('/admin')}
                                className={isDark ? "px-6 py-3 bg-gray-800 text-white font-bold rounded-lg border border-gray-700 hover:border-white transition-all" : "px-6 py-3 bg-zinc-100 text-zinc-900 font-bold rounded-lg border border-zinc-300 hover:bg-zinc-200 transition-all"}
                            >
                                Admin Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/admin/custom-edition')}
                                className={isDark ? "px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg border border-cyan-500 hover:bg-cyan-500 transition-all" : "px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg border border-cyan-400 hover:bg-cyan-600 transition-all"}
                            >
                                Handle Custom Edition Requests
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Account Info */}
                <div className={isDark ? "mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6" : "mt-8 bg-white border border-zinc-200 rounded-lg p-6"}>
                    <h3 className={isDark ? "text-white font-bold mb-4" : "text-zinc-900 font-bold mb-4"}>Account Information</h3>
                    <div className={isDark ? "text-sm text-gray-400 space-y-2" : "text-sm text-zinc-600 space-y-2"}>
                        <p>Account Type: <span className={isDark ? "text-white font-semibold" : "text-zinc-900 font-semibold"}>Premium Member</span></p>
                        <p>Member Since: <span className={isDark ? "text-white font-semibold" : "text-zinc-900 font-semibold"}>Today</span></p>
                        <p>Status: <span className="text-green-400 font-semibold">✓ Active</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
