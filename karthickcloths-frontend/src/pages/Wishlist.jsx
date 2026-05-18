import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

function Wishlist({ isDark }) {
    const navigate = useNavigate();
    const { wishlistItems, removeWishlistItem, clearWishlist } = useWishlist();

    const navigateToProduct = (item) => {
        if (item.route) {
            navigate(item.route);
            return;
        }

        if (item.category === "women") {
            navigate(`/women/${item.id}/details`);
            return;
        }
        if (item.category === "kids") {
            navigate(`/kids/${item.id}/details`);
            return;
        }
        navigate(`/men/${item.id}/details`);
    };

    return (
        <main className={isDark ? "min-h-screen bg-zinc-950 px-4 pb-20 pt-8 text-zinc-100 lg:pb-10" : "min-h-screen bg-zinc-50 px-4 pb-20 pt-8 text-zinc-900 lg:pb-10"}>
            <section className="mx-auto max-w-7xl">
                <div className="fade-up flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className={isDark ? "text-xs uppercase tracking-[0.2em] text-zinc-400" : "text-xs uppercase tracking-[0.2em] text-zinc-500"}>
                            Saved Collection
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold md:text-5xl">My Wishlist</h1>
                        <p className={isDark ? "mt-2 text-sm text-zinc-400" : "mt-2 text-sm text-zinc-600"}>
                            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
                        </p>
                    </div>

                    {wishlistItems.length > 0 ? (
                        <button
                            type="button"
                            onClick={clearWishlist}
                            className={isDark ? "rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-200 transition hover:bg-zinc-900" : "rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700 transition hover:bg-zinc-100"}
                        >
                            Clear Wishlist
                        </button>
                    ) : null}
                </div>

                {wishlistItems.length === 0 ? (
                    <div className={isDark ? "mt-8 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/60 p-10 text-center" : "mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center"}>
                        <p className="text-5xl">♡</p>
                        <h2 className="mt-4 text-2xl font-semibold">Your wishlist is empty</h2>
                        <p className={isDark ? "mx-auto mt-2 max-w-lg text-sm text-zinc-400" : "mx-auto mt-2 max-w-lg text-sm text-zinc-600"}>
                            Tap heart icons on products to save your favorites. Your wishlist is stored locally and stays after refresh.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/constitutional-edition")}
                            className={isDark ? "mt-6 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-zinc-200" : "mt-6 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"}
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {wishlistItems.map((item, index) => (
                            <article
                                key={item.wishlistKey}
                                style={{ animationDelay: `${Math.min(index * 70, 560)}ms` }}
                                className={isDark ? "menwear-card-reveal overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20" : "menwear-card-reveal overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/80"}
                            >
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => navigateToProduct(item)}
                                        className="w-full text-left"
                                    >
                                        <img
                                            src={item.images?.[0]}
                                            alt={item.name}
                                            className="h-72 w-full object-cover"
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => removeWishlistItem(item.wishlistKey)}
                                        className="wishlist-heart-btn wishlist-heart-active absolute right-3 top-3"
                                        aria-label={`Remove ${item.name} from wishlist`}
                                    >
                                        ♥
                                    </button>
                                </div>

                                <div className="p-4">
                                    <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"}>
                                        {item.brand}
                                    </p>
                                    <h3 className="mt-2 line-clamp-2 text-base font-semibold">{item.name}</h3>
                                    <div className="mt-3 flex items-end gap-3">
                                        <span className="text-lg font-bold">₹{item.offerPrice}</span>
                                        {item.originalPrice ? <span className={isDark ? "text-sm text-zinc-400 line-through" : "text-sm text-zinc-500 line-through"}>₹{item.originalPrice}</span> : null}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => navigateToProduct(item)}
                                        className={isDark ? "mt-4 w-full rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:-translate-y-0.5 hover:bg-zinc-800" : "mt-4 w-full rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:bg-zinc-100"}
                                    >
                                        View Product
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Wishlist;
