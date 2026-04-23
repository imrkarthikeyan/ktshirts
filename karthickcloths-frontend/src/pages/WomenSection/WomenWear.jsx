import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWomenProducts } from "../../services/api";
import { womenProductsFallback } from "./womenProductsData";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const priceRanges = [
    { label: "Under ₹400", min: 0, max: 400 },
    { label: "₹401 - ₹500", min: 401, max: 500 },
    { label: "₹501 - ₹700", min: 501, max: 700 },
    { label: "₹701+", min: 701, max: Infinity },
];

const mergeProducts = (apiProducts = []) => {
    const productsById = new Map();

    apiProducts.forEach((product) => {
        productsById.set(product.id, product);
    });

    womenProductsFallback.forEach((product) => {
        productsById.set(product.id, product);
    });

    return Array.from(productsById.values());
};

function WomenWear({ isDark, onSelectProduct }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const [products, setProducts] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSleeves, setSelectedSleeves] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [sortBy, setSortBy] = useState("popular");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [pendingBrands, setPendingBrands] = useState([]);
    const [pendingColors, setPendingColors] = useState([]);
    const [pendingSleeves, setPendingSleeves] = useState([]);
    const [pendingPriceRange, setPendingPriceRange] = useState(null);
    const [showContent, setShowContent] = useState(false);
    const [expandedFilters, setExpandedFilters] = useState({
        brands: false,
        colors: false,
        sizes: false,
        price: false,
    });
    const [quickAddNotification, setQuickAddNotification] = useState(null);

    useEffect(() => {
        setShowContent(true);
    }, []);

    useEffect(() => {
        if (!isMobileFilterOpen) {
            return;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isMobileFilterOpen]);

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                const data = await fetchWomenProducts();
                if (isMounted) {
                    setProducts(mergeProducts(data));
                }
            } catch (error) {
                if (isMounted) {
                    setProducts(womenProductsFallback);
                }
            }
        };

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const brands = useMemo(() => [...new Set(products.map((item) => item.brand))], [products]);
    const colors = useMemo(() => [...new Set(products.flatMap((item) => item.availableColors))], [products]);
    const sleevesOptions = useMemo(() => [...new Set(products.map((item) => item.sleeve))], [products]);

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        if (selectedBrands.length > 0) {
            filtered = filtered.filter((product) => selectedBrands.includes(product.brand));
        }

        if (selectedColors.length > 0) {
            filtered = filtered.filter((product) => selectedColors.some((color) => product.availableColors.includes(color)));
        }

        if (selectedSleeves.length > 0) {
            filtered = filtered.filter((product) => selectedSleeves.includes(product.sleeve));
        }

        if (selectedPriceRange) {
            filtered = filtered.filter((product) => product.offerPrice >= selectedPriceRange.min && product.offerPrice <= selectedPriceRange.max);
        }

        if (sortBy === "price-low") {
            filtered.sort((a, b) => a.offerPrice - b.offerPrice);
        }
        if (sortBy === "price-high") {
            filtered.sort((a, b) => b.offerPrice - a.offerPrice);
        }

        return filtered;
    }, [products, selectedBrands, selectedColors, selectedSleeves, selectedPriceRange, sortBy]);

    const clearFilters = () => {
        setSelectedBrands([]);
        setSelectedColors([]);
        setSelectedSleeves([]);
        setSelectedPriceRange(null);
    };

    const clearPendingFilters = () => {
        setPendingBrands([]);
        setPendingColors([]);
        setPendingSleeves([]);
        setPendingPriceRange(null);
    };

    const hasActiveFilters = selectedBrands.length || selectedColors.length || selectedSleeves.length || selectedPriceRange;

    const toggleOption = (value, setter) => {
        setter((previous) =>
            previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value]
        );
    };

    const toggleFilterSection = (sectionName) => {
        setExpandedFilters((previous) => ({
            ...previous,
            [sectionName]: !previous[sectionName],
        }));
    };

    const openMobileFilters = () => {
        setPendingBrands(selectedBrands);
        setPendingColors(selectedColors);
        setPendingSleeves(selectedSleeves);
        setPendingPriceRange(selectedPriceRange);
        setIsMobileFilterOpen(true);
        setIsSortOpen(false);
    };

    const applyMobileFilters = () => {
        setSelectedBrands(pendingBrands);
        setSelectedColors(pendingColors);
        setSelectedSleeves(pendingSleeves);
        setSelectedPriceRange(pendingPriceRange);
        setIsMobileFilterOpen(false);
    };

    const chooseSort = (value) => {
        setSortBy(value);
        setIsSortOpen(false);
    };

    const pendingFilterCount = pendingBrands.length + pendingColors.length + pendingSleeves.length + (pendingPriceRange ? 1 : 0);

    const handleAddToCart = (e, product) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        onSelectProduct(product.id);
    };

    const handleToggleWishlist = (e, product) => {
        e.stopPropagation();
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
            category: "women",
            route: `/women/${product.id}/details`,
        });
    };

    const getStaggerDelay = (index) => ({
        animationDelay: `${Math.min(index * 70, 560)}ms`,
    });

    return (
        <main className={isDark ? "min-h-screen bg-zinc-950 text-zinc-100" : "min-h-screen bg-zinc-50 text-zinc-900"}>
            {quickAddNotification && (
                <div className="fixed top-32 left-1/2 transform -translate-x-1/2 z-40 bg-green-500 text-white px-6 py-3 rounded-lg animate-fade-up">
                    {quickAddNotification}
                </div>
            )}

            <section className="mx-auto max-w-7xl px-4 pt-12 md:pt-16">
                <div className="fade-up mx-auto max-w-3xl text-center">
                    <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.35em] text-zinc-600"}>
                        Curated Collection
                    </p>
                    <h1 className="mt-4 text-5xl font-semibold tracking-wide md:text-7xl font-[Cormorant_Garamond]">Women Wears</h1>
                    <p className={isDark ? "mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base" : "mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-base"}>
                        Elevated everyday essentials in a clean monochrome experience. Discover premium fits with refined filters and fluid interactions.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <span className={isDark ? "rounded-full border border-zinc-700 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-200" : "rounded-full border border-zinc-300 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700"}>{products.length} Styles</span>
                    <span className={isDark ? "rounded-full border border-zinc-700 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-200" : "rounded-full border border-zinc-300 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700"}>Premium Monochrome</span>
                    <span className={isDark ? "rounded-full border border-zinc-700 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-200" : "rounded-full border border-zinc-300 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700"}>Easy Checkout</span>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-5 px-3 pb-14 pt-8 lg:gap-8 lg:px-4 lg:pt-10 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start">
                <aside className={isDark ? "slide-in-left hidden self-start rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20 lg:sticky lg:top-28 lg:block" : "slide-in-left hidden self-start rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/80 lg:sticky lg:top-28 lg:block"}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold uppercase tracking-[0.22em]">Filters</h2>
                        {hasActiveFilters ? (
                            <button onClick={clearFilters} className="text-xs underline underline-offset-4">
                                Clear All
                            </button>
                        ) : null}
                    </div>

                    <div className="mt-6 space-y-6">
                        <div>
                            <button
                                type="button"
                                onClick={() => toggleFilterSection("brands")}
                                className="flex w-full items-center justify-between"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Brands</p>
                                <span className="text-base">{expandedFilters.brands ? "-" : "+"}</span>
                            </button>
                            {expandedFilters.brands ? (
                                <div className="mt-2 space-y-2">
                                    {brands.map((brand) => (
                                        <label key={brand} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-black"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleOption(brand, setSelectedBrands)}
                                            />
                                            {brand}
                                        </label>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => toggleFilterSection("colors")}
                                className="flex w-full items-center justify-between"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Colors</p>
                                <span className="text-base">{expandedFilters.colors ? "-" : "+"}</span>
                            </button>
                            {expandedFilters.colors ? (
                                <div className="mt-2 space-y-2">
                                    {colors.map((color) => (
                                        <label key={color} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-black"
                                                checked={selectedColors.includes(color)}
                                                onChange={() => toggleOption(color, setSelectedColors)}
                                            />
                                            {color}
                                        </label>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => toggleFilterSection("sizes")}
                                className="flex w-full items-center justify-between"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Sizes</p>
                                <span className="text-base">{expandedFilters.sizes ? "-" : "+"}</span>
                            </button>
                            {expandedFilters.sizes ? (
                                <div className="mt-2 space-y-2">
                                    {sleevesOptions.map((sleeve) => (
                                        <label key={sleeve} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-black"
                                                checked={selectedSleeves.includes(sleeve)}
                                                onChange={() => toggleOption(sleeve, setSelectedSleeves)}
                                            />
                                            {sleeve}
                                        </label>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => toggleFilterSection("price")}
                                className="flex w-full items-center justify-between"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Price</p>
                                <span className="text-base">{expandedFilters.price ? "-" : "+"}</span>
                            </button>
                            {expandedFilters.price ? (
                                <div className="mt-2 space-y-2">
                                    {priceRanges.map((range) => (
                                        <label key={range.label} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="price"
                                                className="h-4 w-4 accent-black"
                                                checked={selectedPriceRange?.label === range.label}
                                                onChange={() => setSelectedPriceRange(range)}
                                            />
                                            {range.label}
                                        </label>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </aside>

                <div className="slide-in-right">
                    <div className={isDark ? "relative mb-4 grid grid-cols-2 overflow-visible rounded-2xl border border-zinc-800 bg-zinc-900 lg:hidden" : "relative mb-4 grid grid-cols-2 overflow-visible rounded-2xl border border-zinc-200 bg-white lg:hidden"}>
                        <button
                            type="button"
                            onClick={() => {
                                setIsSortOpen((previous) => !previous);
                                setIsMobileFilterOpen(false);
                            }}
                            className={isDark ? "flex items-center justify-center gap-2 border-r border-zinc-800 px-3 py-3 text-sm font-semibold tracking-wide text-zinc-100" : "flex items-center justify-center gap-2 border-r border-zinc-200 px-3 py-3 text-sm font-semibold tracking-wide text-zinc-900"}
                        >
                            <span>↕</span>
                            <span>SORT</span>
                        </button>

                        <button
                            type="button"
                            onClick={openMobileFilters}
                            className={isDark ? "flex items-center justify-center gap-2 px-3 py-3 text-sm font-semibold tracking-wide text-zinc-100" : "flex items-center justify-center gap-2 px-3 py-3 text-sm font-semibold tracking-wide text-zinc-900"}
                        >
                            <span>☰</span>
                            <span>FILTER</span>
                            {hasActiveFilters ? (
                                <span className="rounded-full bg-cyan-500 px-2 py-[1px] text-[10px] font-bold text-white">{selectedBrands.length + selectedColors.length + selectedSleeves.length + (selectedPriceRange ? 1 : 0)}</span>
                            ) : null}
                        </button>

                        {isSortOpen ? (
                            <div className={isDark ? "absolute left-2 right-2 top-[calc(100%+8px)] z-20 rounded-xl border border-zinc-700 bg-zinc-950 p-2 shadow-2xl" : "absolute left-2 right-2 top-[calc(100%+8px)] z-20 rounded-xl border border-zinc-300 bg-white p-2 shadow-2xl"}>
                                <button type="button" onClick={() => chooseSort("popular")} className={isDark ? "block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800" : "block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100"}>Most Popular</button>
                                <button type="button" onClick={() => chooseSort("price-low")} className={isDark ? "block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800" : "block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100"}>Price: Low to High</button>
                                <button type="button" onClick={() => chooseSort("price-high")} className={isDark ? "block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800" : "block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100"}>Price: High to Low</button>
                            </div>
                        ) : null}
                    </div>

                    <div className={isDark ? "mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 shadow-lg shadow-black/20" : "mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-lg shadow-zinc-200/70"}>
                        <h2 className="text-lg font-semibold md:text-xl">{filteredProducts.length} Products</h2>
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            className={isDark ? "hidden rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 lg:block" : "hidden rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 lg:block"}
                        >
                            <option value="popular">Sort by: Popular</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>

                    <div className={showContent ? "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5" : "grid grid-cols-2 gap-3 opacity-0 sm:gap-4 lg:grid-cols-3 lg:gap-5"}>
                        {filteredProducts.map((product, index) => (
                            <article
                                key={product.id}
                                style={getStaggerDelay(index)}
                                className={isDark ? "menwear-card-reveal group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20 transition duration-500 hover:-translate-y-1 hover:shadow-2xl" : "menwear-card-reveal group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/80 transition duration-500 hover:-translate-y-1 hover:shadow-2xl"}
                            >
                                <button
                                    type="button"
                                    onClick={(e) => handleToggleWishlist(e, product)}
                                    className={`wishlist-heart-btn absolute right-3 top-3 z-20 ${isWishlisted(product.id, "women") ? "wishlist-heart-active" : ""}`}
                                    aria-label={`Toggle wishlist for ${product.name}`}
                                >
                                    {isWishlisted(product.id, "women") ? "♥" : "♡"}
                                </button>
                                <button onClick={() => onSelectProduct(product.id)} className="w-full text-left">
                                    <div className="relative h-48 overflow-hidden sm:h-64 lg:h-72">
                                        <div className="absolute left-3 top-3 z-10 rounded-full border border-zinc-300/60 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-900 backdrop-blur">
                                            {product.discountPercent}% Off
                                        </div>
                                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                                    </div>
                                    <div className="space-y-1.5 p-3 sm:space-y-2 sm:p-4">
                                        <p className={isDark ? "text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 sm:text-xs sm:tracking-[0.2em]" : "text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 sm:text-xs sm:tracking-[0.2em]"}>{product.brand}</p>
                                        <h3 className="line-clamp-2 text-xs font-semibold sm:text-sm md:text-base">{product.name}</h3>
                                        <div className="flex items-end gap-2 sm:gap-3">
                                            <span className="text-sm font-bold sm:text-base lg:text-lg">₹{product.offerPrice}</span>
                                            <span className={isDark ? "text-xs text-zinc-400 line-through sm:text-sm" : "text-xs text-zinc-500 line-through sm:text-sm"}>₹{product.originalPrice}</span>
                                        </div>
                                        <p className={isDark ? "text-[11px] text-zinc-400 sm:text-xs" : "text-[11px] text-zinc-600 sm:text-xs"}>{product.availableColors[0]} • {product.sleeve}</p>
                                    </div>
                                </button>

                                <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className={isDark ? "w-full rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-white sm:px-4 sm:text-sm" : "w-full rounded-xl border border-zinc-900 bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black sm:px-4 sm:text-sm"}
                                    >
                                        🛒 Add to Cart
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className={isDark ? "rounded-xl border border-dashed border-zinc-700 p-8 text-center text-sm text-zinc-400" : "rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-600"}>
                            No products found for selected filters.
                        </div>
                    ) : null}
                </div>
            </section>

            {isMobileFilterOpen ? (
                <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/45"
                        onClick={() => setIsMobileFilterOpen(false)}
                        aria-label="Close filters"
                    />

                    <div className={isDark ? "absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-y-auto rounded-t-3xl border-t border-zinc-700 bg-zinc-950 p-4" : "absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-y-auto rounded-t-3xl border-t border-zinc-200 bg-white p-4"}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-bold tracking-wide">Filters</h3>
                            <button type="button" onClick={clearPendingFilters} className="text-xs font-semibold underline underline-offset-4">Clear</button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em]">Brands</p>
                                <div className="space-y-2">
                                    {brands.map((brand) => (
                                        <label key={brand} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-black"
                                                checked={pendingBrands.includes(brand)}
                                                onChange={() => toggleOption(brand, setPendingBrands)}
                                            />
                                            {brand}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em]">Colors</p>
                                <div className="space-y-2">
                                    {colors.map((color) => (
                                        <label key={color} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-black"
                                                checked={pendingColors.includes(color)}
                                                onChange={() => toggleOption(color, setPendingColors)}
                                            />
                                            {color}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em]">Sleeves</p>
                                <div className="space-y-2">
                                    {sleevesOptions.map((sleeve) => (
                                        <label key={sleeve} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-black"
                                                checked={pendingSleeves.includes(sleeve)}
                                                onChange={() => toggleOption(sleeve, setPendingSleeves)}
                                            />
                                            {sleeve}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em]">Price</p>
                                <div className="space-y-2">
                                    {priceRanges.map((range) => (
                                        <label key={range.label} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="mobile-women-price"
                                                className="h-4 w-4 accent-black"
                                                checked={pendingPriceRange?.label === range.label}
                                                onChange={() => setPendingPriceRange(range)}
                                            />
                                            {range.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setIsMobileFilterOpen(false)}
                                className={isDark ? "rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200" : "rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700"}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={applyMobileFilters}
                                className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Apply ({pendingFilterCount})
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
}

export default WomenWear;
