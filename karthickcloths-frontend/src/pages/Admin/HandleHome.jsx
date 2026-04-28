import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getHomeContent, homeContentDefaults, resetHomeContent, syncHomeContentFromServer, updateHomeContent } from "../../services/homeStore";

const createProductForm = (product = {}) => ({
    name: product.name || "",
    description: product.description || "",
    originalPrice: String(product.originalPrice ?? ""),
    offerPrice: String(product.offerPrice ?? ""),
    discountPercent: String(product.discountPercent ?? ""),
    defaultColor: product.defaultColor || "",
    availableColors: Array.isArray(product.availableColors) ? product.availableColors.join(", ") : "",
    sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
    sleeve: product.sleeve || "",
    seller: product.seller || "",
    deliveryBy: product.deliveryBy || "",
    sellerRating: String(product.sellerRating ?? ""),
    ratingText: product.ratingText || "",
    imageOne: product.images?.[0] || "",
    imageTwo: product.images?.[1] || "",
    imageThree: product.images?.[2] || "",
    imageFour: product.images?.[3] || "",
});

const createCardForm = (card = {}) => ({
    title: card.title || "",
    subtitle: card.subtitle || "",
    image: card.image || "",
    product: createProductForm(card.product),
});

const toList = (value) =>
    String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const toNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

function HandleHome({ isDark }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [featuredCards, setFeaturedCards] = useState(() => getHomeContent().featuredCards.map(createCardForm));
    const [curatedLooks, setCuratedLooks] = useState(() => getHomeContent().curatedLooks.map(createCardForm));
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!(user?.admin || user?.isAdmin)) {
            navigate("/", { replace: true });
        }
    }, [navigate, user?.admin, user?.isAdmin]);

    useEffect(() => {
        const syncHomeContent = () => {
            const content = getHomeContent();
            setFeaturedCards(content.featuredCards.map(createCardForm));
            setCuratedLooks(content.curatedLooks.map(createCardForm));
        };

        const loadFromServer = async () => {
            await syncHomeContentFromServer(true);
            syncHomeContent();
        };

        syncHomeContent();
        void loadFromServer();
        window.addEventListener("kc-home-content-changed", syncHomeContent);
        return () => window.removeEventListener("kc-home-content-changed", syncHomeContent);
    }, []);

    const updateCard = (collection, index, field, value) => {
        const setter = collection === "featured" ? setFeaturedCards : setCuratedLooks;
        setter((previous) =>
            previous.map((card, currentIndex) =>
                currentIndex === index ? { ...card, [field]: value } : card
            )
        );
    };

    const updateProductField = (collection, index, field, value) => {
        const setter = collection === "featured" ? setFeaturedCards : setCuratedLooks;
        setter((previous) =>
            previous.map((card, currentIndex) =>
                currentIndex === index
                    ? {
                        ...card,
                        product: {
                            ...card.product,
                            [field]: value,
                        },
                    }
                    : card
            )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await updateHomeContent({
                featuredCards: featuredCards.map((card, index) => ({
                    id: index + 1,
                    title: card.title,
                    subtitle: card.subtitle,
                    image: card.image,
                    product: {
                        ...homeContentDefaults.featuredCards[index].product,
                        ...card.product,
                        id: index + 1,
                        originalPrice: toNumber(card.product.originalPrice, homeContentDefaults.featuredCards[index].product.originalPrice),
                        offerPrice: toNumber(card.product.offerPrice, homeContentDefaults.featuredCards[index].product.offerPrice),
                        discountPercent: toNumber(card.product.discountPercent, homeContentDefaults.featuredCards[index].product.discountPercent),
                        sellerRating: toNumber(card.product.sellerRating, homeContentDefaults.featuredCards[index].product.sellerRating),
                        availableColors: toList(card.product.availableColors),
                        sizes: toList(card.product.sizes),
                        images: [card.product.imageOne, card.product.imageTwo, card.product.imageThree, card.product.imageFour].filter(Boolean),
                    },
                })),
                curatedLooks: curatedLooks.map((card, index) => ({
                    id: index + 3,
                    title: card.title,
                    subtitle: card.subtitle,
                    image: card.image,
                    product: {
                        ...homeContentDefaults.curatedLooks[index].product,
                        ...card.product,
                        id: index + 3,
                        originalPrice: toNumber(card.product.originalPrice, homeContentDefaults.curatedLooks[index].product.originalPrice),
                        offerPrice: toNumber(card.product.offerPrice, homeContentDefaults.curatedLooks[index].product.offerPrice),
                        discountPercent: toNumber(card.product.discountPercent, homeContentDefaults.curatedLooks[index].product.discountPercent),
                        sellerRating: toNumber(card.product.sellerRating, homeContentDefaults.curatedLooks[index].product.sellerRating),
                        availableColors: toList(card.product.availableColors),
                        sizes: toList(card.product.sizes),
                        images: [card.product.imageOne, card.product.imageTwo, card.product.imageThree, card.product.imageFour].filter(Boolean),
                    },
                })),
            });

            const successMessage = "Home content saved for all users.";
            setMessage(successMessage);
            window.alert(successMessage);
        } catch (error) {
            const errorMessage = error.message || "Unable to save home content for all users.";
            setMessage(errorMessage);
            window.alert(errorMessage);
        }
    };

    const handleReset = async () => {
        try {
            const content = await resetHomeContent();
            setFeaturedCards(content.featuredCards.map(createCardForm));
            setCuratedLooks(content.curatedLooks.map(createCardForm));
            setMessage("Home content reset for all users.");
        } catch (error) {
            setMessage(error.message || "Unable to reset home content for all users.");
        }
    };

    const pageClass = isDark ? "min-h-screen bg-zinc-950 px-4 pb-12 pt-28 text-zinc-100" : "min-h-screen bg-zinc-50 px-4 pb-12 pt-28 text-zinc-900";
    const cardClass = isDark ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20" : "rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60";
    const inputClass = isDark
        ? "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none placeholder:text-zinc-500"
        : "w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none placeholder:text-zinc-400";

    const renderProductFields = (collection, index, card) => (
        <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Title</span>
                <input value={card.title} onChange={(event) => updateCard(collection, index, "title", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Subtitle</span>
                <input value={card.subtitle} onChange={(event) => updateCard(collection, index, "subtitle", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Image URL</span>
                <input value={card.image} onChange={(event) => updateCard(collection, index, "image", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Product Name</span>
                <input value={card.product.name} onChange={(event) => updateProductField(collection, index, "name", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Description</span>
                <textarea value={card.product.description} onChange={(event) => updateProductField(collection, index, "description", event.target.value)} rows="3" className={inputClass} />
            </label>
            <label className="space-y-2 text-sm">
                <span className="font-medium">Original Price</span>
                <input value={card.product.originalPrice} onChange={(event) => updateProductField(collection, index, "originalPrice", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm">
                <span className="font-medium">Offer Price</span>
                <input value={card.product.offerPrice} onChange={(event) => updateProductField(collection, index, "offerPrice", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm">
                <span className="font-medium">Discount Percent</span>
                <input value={card.product.discountPercent} onChange={(event) => updateProductField(collection, index, "discountPercent", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm">
                <span className="font-medium">Default Color</span>
                <input value={card.product.defaultColor} onChange={(event) => updateProductField(collection, index, "defaultColor", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Available Colors</span>
                <input value={card.product.availableColors} onChange={(event) => updateProductField(collection, index, "availableColors", event.target.value)} className={inputClass} placeholder="Comma separated" />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Sizes</span>
                <input value={card.product.sizes} onChange={(event) => updateProductField(collection, index, "sizes", event.target.value)} className={inputClass} placeholder="Comma separated" />
            </label>
            <label className="space-y-2 text-sm">
                <span className="font-medium">Sleeve</span>
                <input value={card.product.sleeve} onChange={(event) => updateProductField(collection, index, "sleeve", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm">
                <span className="font-medium">Seller Rating</span>
                <input value={card.product.sellerRating} onChange={(event) => updateProductField(collection, index, "sellerRating", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Rating Text</span>
                <input value={card.product.ratingText} onChange={(event) => updateProductField(collection, index, "ratingText", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Image 1</span>
                <input value={card.product.imageOne} onChange={(event) => updateProductField(collection, index, "imageOne", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Image 2</span>
                <input value={card.product.imageTwo} onChange={(event) => updateProductField(collection, index, "imageTwo", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Image 3</span>
                <input value={card.product.imageThree} onChange={(event) => updateProductField(collection, index, "imageThree", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Image 4</span>
                <input value={card.product.imageFour} onChange={(event) => updateProductField(collection, index, "imageFour", event.target.value)} className={inputClass} />
            </label>
        </div>
    );

    return (
        <main className={pageClass}>
            <section className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600"}>
                            Admin workspace
                        </p>
                        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Handle Home</h1>
                        <p className={isDark ? "mt-3 max-w-2xl text-sm leading-7 text-zinc-300" : "mt-3 max-w-2xl text-sm leading-7 text-zinc-600"}>
                            Edit the two featured cards and the five curated looks that appear on the home page.
                        </p>
                    </div>
                    <div className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300" : "rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"}>
                        Signed in as <span className="font-semibold">{user?.fullName}</span>
                    </div>
                </div>

                {message ? (
                    <div className={isDark ? "mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200" : "mb-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"}>
                        {message}
                    </div>
                ) : null}

                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <section className={cardClass}>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Featured cards</p>
                                <h2 className="mt-2 text-2xl font-semibold">On-Trend and Popular Tee</h2>
                            </div>
                            <button type="button" onClick={() => navigate("/admin")} className={isDark ? "rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700"}>
                                Back to Admin
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            {featuredCards.map((card, index) => (
                                <div key={card.title || index} className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4" : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4"}>
                                    <p className="text-sm font-semibold">Featured Card {index + 1}</p>
                                    <div className="mt-4">{renderProductFields("featured", index, card)}</div>
                                </div>
                            ))}

                            <div className="rounded-2xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
                                <p className="text-sm font-semibold">Curated Looks</p>
                                <p className={isDark ? "text-xs text-zinc-400" : "text-xs text-zinc-500"}>Five products are shown in the carousel below the featured cards.</p>

                                <div className="mt-4 space-y-6">
                                    {curatedLooks.map((card, index) => (
                                        <div key={card.title || index} className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4" : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4"}>
                                            <p className="text-sm font-semibold">Look {index + 1}</p>
                                            <div className="mt-4">
                                                {renderProductFields("curated", index, card)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button type="submit" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
                                    Save Home Content
                                </button>
                                <button type="button" onClick={handleReset} className={isDark ? "rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700"}>
                                    Reset Home Content
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className={cardClass}>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Notes</p>
                            <h2 className="mt-2 text-2xl font-semibold">Navigation behavior</h2>
                        </div>

                        <div className={isDark ? "mt-5 space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5" : "mt-5 space-y-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-5"}>
                            <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-300">
                                Tapping <span className="font-semibold">Shop Now</span> on the featured cards opens the matching product details page.
                            </p>
                            <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-300">
                                Tapping a curated look opens its product details page, and <span className="font-semibold">Shop All</span> still routes to the Constitutional Edition page.
                            </p>
                            <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-300">
                                The home carousel is capped at five products, so the layout stays consistent.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

export default HandleHome;