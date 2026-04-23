import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createWhatsappOrderLink, fetchMenProductById } from "../../services/api";
import { menProductsFallback } from "./menProductsData";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function MenWearProductDetails({ isDark }) {
    const { prod_id } = useParams();
    const productId = Number(prod_id);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();

    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadProduct = async () => {
            try {
                const data = await fetchMenProductById(productId);
                if (isMounted) {
                    setProduct(data);
                    setSelectedColor(data.defaultColor || data.availableColors?.[0] || "Black");
                }
            } catch (error) {
                const fallbackProduct = menProductsFallback.find((item) => item.id === productId);
                if (isMounted) {
                    setProduct(fallbackProduct || null);
                    setSelectedColor(fallbackProduct?.defaultColor || fallbackProduct?.availableColors?.[0] || "Black");
                }
            }
        };

        loadProduct();

        return () => {
            isMounted = false;
        };
    }, [productId]);

    const images = useMemo(() => {
        if (!product?.images?.length) {
            return [];
        }
        return product.images;
    }, [product]);

    const canSubmitOrder = selectedColor && selectedSize && quantity > 0 && product;

    const handleToggleWishlist = () => {
        if (!product) {
            return;
        }

        toggleWishlist({
            id: product.id,
            name: product.name,
            brand: product.brand,
            offerPrice: product.offerPrice,
            originalPrice: product.originalPrice,
            discountPercent: product.discountPercent,
            availableColors: product.availableColors,
            sleeve: product.sleeve,
            images: product.images,
            category: "men",
            route: `/men/${product.id}/details`,
        });
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!canSubmitOrder) {
            alert('Please select color and size');
            return;
        }

        setAddingToCart(true);
        try {
            await addToCart({
                productId: product.id,
                productName: product.name,
                brand: product.brand,
                unitPrice: product.offerPrice,
                quantity,
                selectedColor,
                selectedSize,
                productImage: product.images[0],
            });

            setNotification('✓ Added to cart successfully!');
            setTimeout(() => {
                setNotification(null);
                setQuantity(1);
            }, 2000);
        } catch (error) {
            setNotification('✗ Failed to add to cart');
            setTimeout(() => setNotification(null), 2000);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleOrderNow = async () => {
        if (!canSubmitOrder || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await createWhatsappOrderLink({
                productId: product.id,
                productName: product.name,
                color: selectedColor,
                size: selectedSize,
                quantity,
                unitPrice: product.offerPrice,
            });

            window.open(response.whatsappUrl, "_blank", "noopener,noreferrer");
        } catch (error) {
            const fallbackMessage = [
                "Hello Karthick Cloths, I want to order:",
                `Product: ${product.name}`,
                `Product ID: ${product.id}`,
                `Color: ${selectedColor}`,
                `Size: ${selectedSize}`,
                `Quantity: ${quantity}`,
                `Unit Price: Rs.${product.offerPrice}`,
                `Total: Rs.${product.offerPrice * quantity}`,
                "Please confirm availability and delivery.",
            ].join("\n");

            const whatsappUrl = `https://wa.me/9025758149?text=${encodeURIComponent(fallbackMessage)}`;
            window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!product) {
        return (
            <main className={isDark ? "min-h-screen bg-black px-4 py-12 text-zinc-100" : "min-h-screen bg-white px-4 py-12 text-zinc-900"}>
                <div className="mx-auto max-w-6xl">
                    <button
                        onClick={() => navigate("/men")}
                        className={isDark ? "rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-white" : "rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:border-black"}
                    >
                        Back To Men Wear
                    </button>
                    <p className="mt-8 text-lg">Loading product details...</p>
                </div>
            </main>
        );
    }

    return (
        <main className={isDark ? "min-h-screen bg-black text-zinc-100" : "min-h-screen bg-white text-zinc-900"}>
            {notification && (
                <div className={notification.includes('✓') ? 'fixed top-32 left-1/2 transform -translate-x-1/2 z-40 bg-green-500 text-white px-6 py-3 rounded-lg animate-fade-up' : 'fixed top-32 left-1/2 transform -translate-x-1/2 z-40 bg-red-500 text-white px-6 py-3 rounded-lg animate-fade-up'}>
                    {notification}
                </div>
            )}
            <section className="mx-auto max-w-7xl px-4 pb-12 pt-6 md:pt-10">
                <button
                    onClick={() => navigate("/men")}
                    className={isDark ? "fade-up rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white hover:text-white" : "fade-up rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-black hover:text-black"}
                >
                    Back To Men Wear
                </button>

                <div className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-[1.1fr_1fr]">
                    <div className="slide-in-left space-y-3">
                        <div className={isDark ? "relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950" : "relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"}>
                            <img
                                src={images[activeImage]}
                                alt={product.name}
                                className="h-[430px] w-full object-cover md:h-[560px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {images.slice(0, 4).map((image, index) => (
                                <button
                                    key={image}
                                    onClick={() => setActiveImage(index)}
                                    className={activeImage === index
                                        ? "overflow-hidden rounded-xl border-2 border-black shadow-md shadow-black/20 dark:border-white"
                                        : isDark
                                            ? "overflow-hidden rounded-xl border border-zinc-700"
                                            : "overflow-hidden rounded-xl border border-zinc-300"}
                                >
                                    <img src={image} alt={`${product.name} view ${index + 1}`} className="h-24 w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="slide-in-right">
                        <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500"}>
                            {product.brand}
                        </p>
                        <div className="mt-2 flex items-start justify-between gap-4">
                            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">{product.name}</h1>
                            <button
                                type="button"
                                onClick={handleToggleWishlist}
                                className={`wishlist-heart-btn ${isWishlisted(product.id, "men") ? "wishlist-heart-active" : ""}`}
                                aria-label="Toggle wishlist"
                            >
                                {isWishlisted(product.id, "men") ? "♥" : "♡"}
                            </button>
                        </div>

                        <div className="mt-4 flex items-end gap-3">
                            <span className="text-sm font-semibold">{product.discountPercent}%</span>
                            <span className="text-3xl font-bold">{product.originalPrice}</span>
                            <span className={isDark ? "text-xl font-semibold text-zinc-100" : "text-xl font-semibold text-zinc-900"}>₹{product.offerPrice}</span>
                        </div>

                        <div className={isDark ? "mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5" : "mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5"}>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Selected Color:</p>
                                <p className="text-sm font-semibold">{selectedColor || "Black"}</p>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {product.availableColors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={selectedColor === color
                                            ? "rounded-full border border-black bg-black px-4 py-2 text-xs font-semibold text-white dark:border-white dark:bg-white dark:text-black"
                                            : isDark
                                                ? "rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200"
                                                : "rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700"}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm font-medium">Select Size</p>
                                <button
                                    onClick={() => setShowSizeChart((prev) => !prev)}
                                    className={isDark ? "text-sm underline underline-offset-4 hover:text-white" : "text-sm underline underline-offset-4 hover:text-black"}
                                >
                                    Size Chart
                                </button>
                            </div>

                            {showSizeChart && (
                                <div className={isDark ? "mt-3 rounded-xl border border-zinc-700 p-3 text-xs text-zinc-300" : "mt-3 rounded-xl border border-zinc-300 p-3 text-xs text-zinc-700"}>
                                    <p>M: Chest 38-40</p>
                                    <p>L: Chest 40-42</p>
                                    <p>XL: Chest 42-44</p>
                                    <p>2XL: Chest 44-46</p>
                                </div>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={selectedSize === size
                                            ? "rounded-lg border border-black bg-black px-5 py-2 text-sm font-semibold text-white dark:border-white dark:bg-white dark:text-black"
                                            : isDark
                                                ? "rounded-lg border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-200"
                                                : "rounded-lg border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700"}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>

                            {selectedColor && selectedSize && (
                                <div className="mt-6 fade-up">
                                    <p className="text-sm font-medium">Quantity</p>
                                    <div className="mt-2 inline-flex items-center overflow-hidden rounded-lg border border-zinc-400 dark:border-zinc-600">
                                        <button
                                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                            className={isDark ? "px-4 py-2 text-lg text-zinc-100 hover:bg-zinc-800" : "px-4 py-2 text-lg text-zinc-900 hover:bg-zinc-100"}
                                        >
                                            -
                                        </button>
                                        <span className={isDark ? "min-w-10 px-4 text-center text-sm text-zinc-100" : "min-w-10 px-4 text-center text-sm text-zinc-900"}>{quantity}</span>
                                        <button
                                            onClick={() => setQuantity((prev) => prev + 1)}
                                            className={isDark ? "px-4 py-2 text-lg text-zinc-100 hover:bg-zinc-800" : "px-4 py-2 text-lg text-zinc-900 hover:bg-zinc-100"}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleAddToCart}
                                disabled={!canSubmitOrder || addingToCart}
                                className={!canSubmitOrder || addingToCart
                                    ? "mt-6 w-full cursor-not-allowed rounded-xl bg-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500"
                                    : "mt-6 w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-200"}
                            >
                                {addingToCart ? "Adding to Cart..." : "🛒 Add to Cart"}
                            </button>

                            <button
                                onClick={handleOrderNow}
                                disabled={!canSubmitOrder || isSubmitting}
                                className={!canSubmitOrder || isSubmitting
                                    ? "mt-3 w-full cursor-not-allowed rounded-xl bg-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500"
                                    : "mt-3 w-full rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"}
                            >
                                {isSubmitting ? "Preparing WhatsApp..." : "💬 Order via WhatsApp"}
                            </button>
                        </div>

                        <div className={isDark ? "mt-6 rounded-2xl border border-zinc-800 p-5" : "mt-6 rounded-2xl border border-zinc-200 p-5"}>
                            <h3 className="text-base font-semibold">Delivery details</h3>
                            <div className="mt-3 space-y-2 text-sm">
                                <p>Location not set</p>
                                <p className="font-medium">Select delivery location</p>
                                <p>
                                    Delivery <span className="font-semibold">by {product.deliveryBy}</span>
                                </p>
                                <p>Fulfilled by {product.seller}</p>
                                <p>
                                    {product.sellerRating} • {product.ratingText}
                                </p>
                                <p>10-Day Return</p>
                                <p>Cash on Delivery</p>
                                <p>Flipkart Assured</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default MenWearProductDetails;
