import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WISHLIST_STORAGE_KEY = "kc-wishlist";
const WishlistContext = createContext();

const getItemKey = (itemOrId, category = "general") => {
    if (typeof itemOrId === "object" && itemOrId !== null) {
        return `${itemOrId.category || "general"}-${itemOrId.id}`;
    }
    return `${category}-${itemOrId}`;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (!raw) {
                return;
            }
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                setWishlistItems(parsed);
            }
        } catch (error) {
            console.error("Failed to parse wishlist from storage:", error);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const isWishlisted = (itemOrId, category = "general") => {
        const key = getItemKey(itemOrId, category);
        return wishlistItems.some((item) => item.wishlistKey === key);
    };

    const toggleWishlist = (item) => {
        const normalizedItem = {
            ...item,
            category: item.category || "general",
        };
        const wishlistKey = getItemKey(normalizedItem);

        setWishlistItems((previous) => {
            const exists = previous.some((wishlistItem) => wishlistItem.wishlistKey === wishlistKey);
            if (exists) {
                return previous.filter((wishlistItem) => wishlistItem.wishlistKey !== wishlistKey);
            }

            return [
                {
                    ...normalizedItem,
                    wishlistKey,
                    addedAt: new Date().toISOString(),
                },
                ...previous,
            ];
        });
    };

    const removeWishlistItem = (wishlistKey) => {
        setWishlistItems((previous) => previous.filter((item) => item.wishlistKey !== wishlistKey));
    };

    const clearWishlist = () => {
        setWishlistItems([]);
    };

    const value = useMemo(() => ({
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isWishlisted,
        toggleWishlist,
        removeWishlistItem,
        clearWishlist,
    }), [wishlistItems]);

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
