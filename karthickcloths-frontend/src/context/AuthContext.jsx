import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL, requestSignupOtp as requestOtpApi, verifySignupOtp as verifyOtpApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize from localStorage immediately
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('authToken') || null;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signup = async (signupData) => {
        return requestSignupOtp(signupData);
    };

    const requestSignupOtp = async (signupData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await requestOtpApi(signupData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const verifySignupOtp = async (email, otp) => {
        setLoading(true);
        setError(null);
        try {
            const data = await verifyOtpApi(email, otp);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            console.log('[AuthContext] Login successful, received data:', {
                hasToken: !!data.token,
                tokenLength: data.token?.length || 0,
                email: data.email
            });

            // Save token and user info
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            console.log('[AuthContext] Token saved to localStorage:', {
                storedToken: localStorage.getItem('authToken')?.substring(0, 20) + '...',
                storedUser: localStorage.getItem('user')?.substring(0, 30) + '...'
            });

            setToken(data.token);
            setUser(data);

            console.log('[AuthContext] State updated with token:', {
                newToken: data.token?.substring(0, 20) + '...'
            });

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }

            // Update local storage
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            signup,
            requestSignupOtp,
            verifySignupOtp,
            login,
            logout,
            updateProfile,
            isAuthenticated: !!token,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
