import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token, isAuthenticated, logout } = useAuth();

    // Fetch cart items when component mounts or token changes
    useEffect(() => {
        if (isAuthenticated && token) {
            fetchCartItems();
        } else {
            setCartItems([]);
            setCartTotal(0);
        }
    }, [token, isAuthenticated]);

    const handleResponse = async (response) => {
        if (response.status === 401) {
            logout();
            throw new Error('Unauthorized - Please login');
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
        return data;
    };

    const fetchCartItems = async () => {
        if (!token) {
            setError('Not authenticated');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/cart/items`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await handleResponse(response);
            setCartItems(data.items || []);
            setCartTotal(data.total || 0);
        } catch (err) {
            setError(err.message);
            console.error('[CartContext] Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (cartItemData) => {
        if (!token) {
            const err = new Error('Authentication required. Please login first.');
            setError(err.message);
            throw err;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(cartItemData),
            });

            const data = await handleResponse(response);
            await fetchCartItems();
            return data.data;
        } catch (err) {
            setError(err.message);
            console.error('[CartContext] Error adding to cart:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCartItem = async (cartItemId, quantity) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/cart/update/${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity }),
            });

            await handleResponse(response);
            await fetchCartItems();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeCartItem = async (cartItemId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/cart/remove/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            await handleResponse(response);
            await fetchCartItems();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/cart/clear`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            await handleResponse(response);
            setCartItems([]);
            setCartTotal(0);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartTotal,
            loading,
            error,
            addToCart,
            updateCartItem,
            removeCartItem,
            clearCart,
            fetchCartItems,
            itemCount: cartItems.length,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
