import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllCatalogProducts } from "../services/catalogStore";

function Search({ isDark }) {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = () => {
            setProducts(getAllCatalogProducts());
            setLoading(false);
        };

        loadProducts();

        const syncProducts = () => setProducts(getAllCatalogProducts());
        window.addEventListener("kc-catalog-changed", syncProducts);

        return () => window.removeEventListener("kc-catalog-changed", syncProducts);
    }, []);

    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    const normalizedQuery = query.trim().toLowerCase();

    const filteredProducts = useMemo(() => {
        if (!normalizedQuery) {
            return products;
        }

        return products.filter((product) => {
            const searchableText = [
                product.name,
                product.brand,
                product.defaultColor,
                ...(product.availableColors || []),
                product.sleeve,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedQuery);
        });
    }, [products, normalizedQuery]);

    const handleSearch = () => {
        const nextQuery = query.trim();
        setSearchParams(nextQuery ? { q: nextQuery } : {});
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    };

    const productLabel = filteredProducts.length === 1 ? "product" : "products";

    return (
        <main className={isDark ? "min-h-screen bg-black px-4 pb-12 pt-24 text-zinc-100 sm:px-6 lg:px-8" : "min-h-screen bg-zinc-50 px-4 pb-12 pt-24 text-zinc-900 sm:px-6 lg:px-8"}>
            <section className="mx-auto max-w-7xl">
                <div className="mb-8 animate-fade-up">
                    <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600"}>
                        Search
                    </p>
                    <h1 className="mt-3 text-4xl font-black sm:text-5xl">Find products</h1>
                    <p className={isDark ? "mt-3 max-w-2xl text-sm leading-7 text-zinc-300" : "mt-3 max-w-2xl text-sm leading-7 text-zinc-600"}>
                        Search across men, women, and kids collections by product name, brand, color, or style.
                    </p>
                </div>

                <div className={isDark ? "mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl shadow-black/20" : "mb-8 rounded-3xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-200/70"}>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className={isDark ? "flex flex-1 items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" : "flex flex-1 items-center gap-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3"}>
                            <span>🔍</span>
                            <input
                                type="text"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Search products"
                                className={isDark ? "w-full border-0 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500" : "w-full border-0 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setSearchParams({});
                            }}
                            className={isDark ? "rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800" : "rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className={isDark ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center text-sm text-zinc-300" : "rounded-3xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600"}>
                        Loading search results...
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className={isDark ? "rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center" : "rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center"}>
                        <h2 className="text-2xl font-bold">No results found</h2>
                        <p className={isDark ? "mt-2 text-sm text-zinc-400" : "mt-2 text-sm text-zinc-600"}>
                            Try a different keyword or search by brand, color, or product type.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-5 flex items-center justify-between">
                            <p className={isDark ? "text-sm text-zinc-400" : "text-sm text-zinc-600"}>
                                {filteredProducts.length} {productLabel} found
                            </p>
                            {normalizedQuery ? <p className={isDark ? "text-sm text-zinc-400" : "text-sm text-zinc-600"}>Showing results for “{query.trim()}”</p> : null}
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                            {filteredProducts.map((product) => (
                                <button
                                    key={`${product.category}-${product.id}`}
                                    type="button"
                                    onClick={() => navigate(product.route)}
                                    className={isDark ? "group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 text-left shadow-lg shadow-black/20 transition hover:-translate-y-1" : "group overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-lg shadow-zinc-200/70 transition hover:-translate-y-1"}
                                >
                                    <div className="relative h-52 overflow-hidden sm:h-64">
                                        <img
                                            src={product.images?.[0] || "https://via.placeholder.com/400"}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="space-y-2 p-4">
                                        <p className={isDark ? "text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400" : "text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500"}>
                                            {product.brand}
                                        </p>
                                        <h2 className="line-clamp-2 text-sm font-semibold sm:text-base">{product.name}</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-bold">₹{product.offerPrice}</span>
                                            <span className={isDark ? "text-xs text-zinc-400 line-through" : "text-xs text-zinc-500 line-through"}>₹{product.originalPrice}</span>
                                        </div>
                                        <p className={isDark ? "text-xs text-zinc-400" : "text-xs text-zinc-600"}>
                                            {product.defaultColor} • {product.sleeve}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default Search;
