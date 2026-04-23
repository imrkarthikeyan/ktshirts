import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = ({ isDark }) => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, loading, removeCartItem, updateCartItem, clearCart } = useCart();
    const { user } = useAuth();
    const [updatingId, setUpdatingId] = useState(null);

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(cartItemId);
            return;
        }
        setUpdatingId(cartItemId);
        try {
            await updateCartItem(cartItemId, newQuantity);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            await removeCartItem(cartItemId);
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout', { state: { items: cartItems, total: cartTotal } });
    };

    const handleContinueShopping = () => {
        navigate('/men');
    };

    if (loading) {
        return (
            <div className={isDark ? "min-h-screen bg-black flex items-center justify-center pt-20" : "min-h-screen bg-zinc-50 flex items-center justify-center pt-20"}>
                <div className={isDark ? "text-white text-xl" : "text-zinc-900 text-xl"}>Loading cart...</div>
            </div>
        );
    }

    return (
        <div className={isDark ? "min-h-screen bg-black pt-20 pb-12 px-4 sm:px-6 lg:px-8" : "min-h-screen bg-zinc-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8"}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 animate-fade-up">
                    <h1 className={isDark ? "text-4xl sm:text-5xl font-black text-white mb-2" : "text-4xl sm:text-5xl font-black text-zinc-900 mb-2"}>
                        Shopping Cart
                    </h1>
                    <p className={isDark ? "text-gray-400 text-sm" : "text-zinc-600 text-sm"}>
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    // Empty Cart
                    <div className={isDark ? "bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center animate-fade-up" : "bg-white border border-zinc-200 rounded-2xl p-12 text-center animate-fade-up"}>
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className={isDark ? "text-2xl font-bold text-white mb-2" : "text-2xl font-bold text-zinc-900 mb-2"}>Your cart is empty</h2>
                        <p className={isDark ? "text-gray-400 mb-8" : "text-zinc-600 mb-8"}>Start shopping to add items to your cart</p>
                        <button
                            onClick={handleContinueShopping}
                            className={isDark ? "inline-block px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105" : "inline-block px-8 py-3 bg-zinc-900 text-white font-bold rounded-lg hover:bg-black transition-all transform hover:scale-105"}
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {cartItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={isDark ? "bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all animate-fade-up" : "bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-300 transition-all animate-fade-up"}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex gap-6">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={item.productImage || 'https://via.placeholder.com/150'}
                                                    alt={item.productName}
                                                    className={isDark ? "w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg bg-gray-800" : "w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg bg-zinc-100"}
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                                    <div className="flex-1">
                                                        <h3 className={isDark ? "text-lg font-bold text-white mb-1" : "text-lg font-bold text-zinc-900 mb-1"}>
                                                            {item.productName}
                                                        </h3>
                                                        <p className={isDark ? "text-gray-400 text-sm mb-3" : "text-zinc-600 text-sm mb-3"}>
                                                            {item.brand}
                                                        </p>

                                                        {/* Specifications */}
                                                        <div className="flex flex-wrap gap-4 text-sm">
                                                            <div>
                                                                <span className={isDark ? "text-gray-500" : "text-zinc-500"}>Color:</span>
                                                                <span className={isDark ? "text-white ml-2 font-semibold" : "text-zinc-900 ml-2 font-semibold"}>
                                                                    {item.selectedColor}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className={isDark ? "text-gray-500" : "text-zinc-500"}>Size:</span>
                                                                <span className={isDark ? "text-white ml-2 font-semibold" : "text-zinc-900 ml-2 font-semibold"}>
                                                                    {item.selectedSize}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Price and Quantity */}
                                                    <div className="text-right sm:text-left">
                                                        <div className={isDark ? "text-2xl font-black text-white mb-3" : "text-2xl font-black text-zinc-900 mb-3"}>
                                                            ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                                                        </div>

                                                        {/* Quantity Selector */}
                                                        <div className={isDark ? "flex items-center gap-3 mb-4 bg-gray-800 rounded-lg p-2 w-fit" : "flex items-center gap-3 mb-4 bg-zinc-100 rounded-lg p-2 w-fit"}>
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                disabled={updatingId === item.id}
                                                                className={isDark ? "px-3 py-1 text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50" : "px-3 py-1 text-zinc-900 hover:bg-zinc-200 rounded transition-colors disabled:opacity-50"}
                                                            >
                                                                −
                                                            </button>
                                                            <span className={isDark ? "px-4 py-1 text-white font-semibold min-w-12 text-center" : "px-4 py-1 text-zinc-900 font-semibold min-w-12 text-center"}>
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                disabled={updatingId === item.id}
                                                                className={isDark ? "px-3 py-1 text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50" : "px-3 py-1 text-zinc-900 hover:bg-zinc-200 rounded transition-colors disabled:opacity-50"}
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        {/* Unit Price Info */}
                                                        <p className={isDark ? "text-gray-400 text-xs" : "text-zinc-600 text-xs"}>
                                                            ₹{item.unitPrice.toLocaleString('en-IN')} each
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Remove Button */}
                                                <div className={isDark ? "mt-4 border-t border-gray-800 pt-4" : "mt-4 border-t border-zinc-200 pt-4"}>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors"
                                                    >
                                                        Remove Item
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className={isDark ? "bg-gray-900 border border-gray-800 rounded-2xl p-8 sticky top-32 animate-fade-up" : "bg-white border border-zinc-200 rounded-2xl p-8 sticky top-32 animate-fade-up"} style={{ animationDelay: '0.3s' }}>
                                <h2 className={isDark ? "text-xl font-bold text-white mb-6" : "text-xl font-bold text-zinc-900 mb-6"}>Order Summary</h2>

                                {/* Summary Items */}
                                <div className={isDark ? "space-y-3 mb-6 pb-6 border-b border-gray-800" : "space-y-3 mb-6 pb-6 border-b border-zinc-200"}>
                                    <div className="flex justify-between text-sm">
                                        <span className={isDark ? "text-gray-400" : "text-zinc-600"}>Subtotal</span>
                                        <span className={isDark ? "text-white font-semibold" : "text-zinc-900 font-semibold"}>
                                            ₹{cartTotal.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className={isDark ? "text-gray-400" : "text-zinc-600"}>Shipping</span>
                                        <span className="text-green-400 font-semibold">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className={isDark ? "text-gray-400" : "text-zinc-600"}>Tax</span>
                                        <span className={isDark ? "text-white font-semibold" : "text-zinc-900 font-semibold"}>
                                            ₹{Math.round(cartTotal * 0.18).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center mb-8">
                                    <span className={isDark ? "text-white font-semibold" : "text-zinc-900 font-semibold"}>Total</span>
                                    <span className={isDark ? "text-3xl font-black text-white" : "text-3xl font-black text-zinc-900"}>
                                        ₹{Math.round(cartTotal * 1.18).toLocaleString('en-IN')}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    className={isDark ? "w-full px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-105 mb-3" : "w-full px-6 py-3 bg-zinc-900 text-white font-bold rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white transition-all transform hover:scale-105 mb-3"}
                                >
                                    Proceed to Checkout
                                </button>

                                {/* Continue Shopping */}
                                <button
                                    onClick={handleContinueShopping}
                                    className={isDark ? "w-full px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-all" : "w-full px-6 py-3 bg-zinc-100 text-zinc-900 font-bold rounded-lg hover:bg-zinc-200 transition-all"}
                                >
                                    Continue Shopping
                                </button>

                                {/* Clear Cart */}
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to clear your cart?')) {
                                            clearCart();
                                        }
                                    }}
                                    className="w-full mt-3 px-6 py-2 text-red-500 hover:text-red-400 text-sm font-semibold transition-colors"
                                >
                                    Clear Cart
                                </button>

                                {/* Info */}
                                <div className={isDark ? "mt-6 pt-6 border-t border-gray-800" : "mt-6 pt-6 border-t border-zinc-200"}>
                                    <p className={isDark ? "text-xs text-gray-400 text-center" : "text-xs text-zinc-600 text-center"}>
                                        ✓ Free Shipping on all orders
                                        <br />
                                        ✓ 7-day returns
                                        <br />
                                        ✓ Secure checkout
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
