import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { requestSignupOtp, verifySignupOtp, loading, error: authError } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        pincode: '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
        setError(null);
        setSuccessMessage(null);
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!formData.phoneNumber.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
            setError('Phone number must be 10 digits');
            return false;
        }
        if (!formData.address.trim()) {
            setError('Address is required');
            return false;
        }
        if (!formData.pincode.trim()) {
            setError('Pincode is required');
            return false;
        }
        if (!/^[0-9]{6}$/.test(formData.pincode)) {
            setError('Pincode must be 6 digits');
            return false;
        }
        return true;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!validateForm()) {
            return;
        }

        try {
            const response = await requestSignupOtp(formData);
            const message = response?.message || 'OTP sent to your email';
            if (message.toLowerCase().includes('admin registered')) {
                setSuccessMessage('Admin account created successfully. Please login.');
                setTimeout(() => navigate('/login'), 900);
                return;
            }

            setOtpSent(true);
            setSuccessMessage(message);
        } catch (err) {
            setError(err.message || 'Signup failed');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!otp || otp.length !== 6) {
            setError('Please enter valid 6-digit OTP');
            return;
        }

        try {
            await verifySignupOtp(formData.email, otp);
            setSuccessMessage('Signup successful. Please login.');
            setTimeout(() => navigate('/login'), 900);
        } catch (err) {
            setError(err.message || 'OTP verification failed');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-200 dark:border-gray-800">
                    {/* Header */}
                    <div className="text-center mb-8 animate-fade-up">
                        <h1 className="text-4xl font-black text-black dark:text-white mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Join us for the best shopping experience
                        </p>
                    </div>

                    {/* Error Alert */}
                    {(error || authError) && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-up">
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                                {error || authError}
                            </p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fade-up">
                            <p className="text-green-600 dark:text-green-400 text-sm font-medium">{successMessage}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                        {/* Full Name */}
                        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
                            <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        {/* Email */}
                        <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
                            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            <label htmlFor="phoneNumber" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="9876543210"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        {/* Address */}
                        <div className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
                            <label htmlFor="address" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="123 Main St, City, State"
                                rows="2"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm resize-none"
                            />
                        </div>

                        {/* Pincode */}
                        <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
                            <label htmlFor="pincode" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Pincode
                            </label>
                            <input
                                type="text"
                                id="pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="123456"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        {/* Password */}
                        <div className="animate-fade-up" style={{ animationDelay: '0.35s' }}>
                            <label htmlFor="password" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
                            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {otpSent ? (
                            <div className="animate-fade-up" style={{ animationDelay: '0.45s' }}>
                                <label htmlFor="otp" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Email OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"
                                />
                            </div>
                        ) : null}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 px-4 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 animate-fade-up text-sm"
                            style={{ animationDelay: '0.45s' }}
                        >
                            {loading ? (otpSent ? 'Verifying OTP...' : 'Sending OTP...') : (otpSent ? 'Verify OTP & Create Account' : 'Send OTP')}
                        </button>

                        {otpSent ? (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-semibold"
                            >
                                Resend OTP
                            </button>
                        ) : null}
                    </form>

                    {/* Divider */}
                    <div className="mt-6 mb-4 flex items-center">
                        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                        <div className="px-3 text-gray-500 dark:text-gray-400 text-xs font-medium">OR</div>
                        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center animate-fade-up" style={{ animationDelay: '0.5s' }}>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                            Already have an account?{' '}
                            <Link to="/login" className="text-black dark:text-white font-bold hover:underline transition-all">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="text-center mt-6 text-gray-500 dark:text-gray-400 text-xs">
                    <p>By creating an account, you agree to our Terms & Conditions</p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
