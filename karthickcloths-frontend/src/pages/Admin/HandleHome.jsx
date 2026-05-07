import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getHomeContent, homeContentDefaults, resetHomeContent, syncHomeContentFromServer, updateHomeContent } from "../../services/homeStore";

const createProductForm = (product = {}) => ({
    id: product.id || "",
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
    id: card.id || card.product?.id || "",
    title: card.title || "",
    subtitle: card.subtitle || "",
    image: card.image || "",
    product: createProductForm(card.product),
});

const createHeroSlideForm = (slide = {}) => ({
    id: slide.id || "",
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    offer: slide.offer || "",
    cta: slide.cta || "",
    image: slide.image || "",
    targetPath: slide.targetPath || "/constitutional-edition",
});

const createCategoryItemForm = (item = {}) => ({
    id: item.id || "",
    title: item.title || "",
    image: item.image || "",
    targetPath: item.targetPath || "/constitutional-edition",
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
    const [heroSlides, setHeroSlides] = useState(() => getHomeContent().heroSlides.map(createHeroSlideForm));
    const [categoryItems, setCategoryItems] = useState(() => getHomeContent().categoryItems.map(createCategoryItemForm));
    const [editingHeroIndex, setEditingHeroIndex] = useState(0);
    const [editingCategoryIndex, setEditingCategoryIndex] = useState(0);
    const [message, setMessage] = useState(null);
    const heroEditorRef = useRef(null);
    const categoryEditorRef = useRef(null);

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
            setHeroSlides(content.heroSlides.map(createHeroSlideForm));
            setCategoryItems(content.categoryItems.map(createCategoryItemForm));
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

    const deleteCard = (collection, id) => {
        const setter = collection === "featured" ? setFeaturedCards : setCuratedLooks;
        setter((previous) => previous.filter((card) => card.id !== id));
    };

    const updateHeroSlideField = (index, field, value) => {
        setHeroSlides((previous) =>
            previous.map((slide, currentIndex) =>
                currentIndex === index ? { ...slide, [field]: value } : slide
            )
        );
    };

    const updateCategoryItemField = (index, field, value) => {
        setCategoryItems((previous) =>
            previous.map((item, currentIndex) =>
                currentIndex === index ? { ...item, [field]: value } : item
            )
        );
    };

    const persistHomeContent = async (updates, successMessage, failureMessage) => {
        try {
            await updateHomeContent(updates);
            setMessage(successMessage);
            window.alert(successMessage);
        } catch (error) {
            const errorMessage = error.message || failureMessage;
            setMessage(errorMessage);
            window.alert(errorMessage);
        }
    };

    const serializeFeaturedCards = () =>
        featuredCards.map((card, index) => ({
            id: Number(card.id) || index + 1,
            title: card.title,
            subtitle: card.subtitle,
            image: card.image,
            product: {
                ...homeContentDefaults.featuredCards[index % homeContentDefaults.featuredCards.length].product,
                ...card.product,
                id: Number(card.product.id) || Number(card.id) || index + 1,
                originalPrice: toNumber(card.product.originalPrice, homeContentDefaults.featuredCards[index % homeContentDefaults.featuredCards.length].product.originalPrice),
                offerPrice: toNumber(card.product.offerPrice, homeContentDefaults.featuredCards[index % homeContentDefaults.featuredCards.length].product.offerPrice),
                discountPercent: toNumber(card.product.discountPercent, homeContentDefaults.featuredCards[index % homeContentDefaults.featuredCards.length].product.discountPercent),
                sellerRating: toNumber(card.product.sellerRating, homeContentDefaults.featuredCards[index % homeContentDefaults.featuredCards.length].product.sellerRating),
                availableColors: toList(card.product.availableColors),
                sizes: toList(card.product.sizes),
                images: [card.product.imageOne, card.product.imageTwo, card.product.imageThree, card.product.imageFour].filter(Boolean),
            },
        }));

    const serializeCuratedLooks = () =>
        curatedLooks.map((card, index) => ({
            id: Number(card.id) || index + 3,
            title: card.title,
            subtitle: card.subtitle,
            image: card.image,
            product: {
                ...homeContentDefaults.curatedLooks[index % homeContentDefaults.curatedLooks.length].product,
                ...card.product,
                id: Number(card.product.id) || Number(card.id) || index + 3,
                originalPrice: toNumber(card.product.originalPrice, homeContentDefaults.curatedLooks[index % homeContentDefaults.curatedLooks.length].product.originalPrice),
                offerPrice: toNumber(card.product.offerPrice, homeContentDefaults.curatedLooks[index % homeContentDefaults.curatedLooks.length].product.offerPrice),
                discountPercent: toNumber(card.product.discountPercent, homeContentDefaults.curatedLooks[index % homeContentDefaults.curatedLooks.length].product.discountPercent),
                sellerRating: toNumber(card.product.sellerRating, homeContentDefaults.curatedLooks[index % homeContentDefaults.curatedLooks.length].product.sellerRating),
                availableColors: toList(card.product.availableColors),
                sizes: toList(card.product.sizes),
                images: [card.product.imageOne, card.product.imageTwo, card.product.imageThree, card.product.imageFour].filter(Boolean),
            },
        }));

    const serializeHeroSlides = () =>
        heroSlides.map((slide, index) => ({
            id: index + 1,
            title: slide.title,
            subtitle: slide.subtitle,
            offer: slide.offer,
            cta: slide.cta,
            image: slide.image,
            targetPath: slide.targetPath,
        }));

    const serializeCategoryItems = () =>
        categoryItems.map((item, index) => ({
            id: index + 1,
            title: item.title,
            image: item.image,
            targetPath: item.targetPath,
        }));

    const saveFeaturedCards = async () => {
        await persistHomeContent(
            { featuredCards: serializeFeaturedCards() },
            "Featured cards saved successfully.",
            "Unable to save featured cards."
        );
    };

    const saveCuratedLooks = async () => {
        await persistHomeContent(
            { curatedLooks: serializeCuratedLooks() },
            "Curated looks saved successfully.",
            "Unable to save curated looks."
        );
    };

    const saveHeroSlides = async () => {
        await persistHomeContent(
            { heroSlides: serializeHeroSlides() },
            "Hero slides saved successfully.",
            "Unable to save hero slides."
        );
    };

    const saveCategoryItems = async () => {
        await persistHomeContent(
            { categoryItems: serializeCategoryItems() },
            "Category items saved successfully.",
            "Unable to save category items."
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await saveFeaturedCards();
    };

    const openHeroEditor = (index) => {
        setEditingHeroIndex(index);
        window.requestAnimationFrame(() => {
            heroEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    const openCategoryEditor = (index) => {
        setEditingCategoryIndex(index);
        window.requestAnimationFrame(() => {
            categoryEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    const addHeroSlide = () => {
        setHeroSlides((previous) => [...previous, createHeroSlideForm({ id: previous.length + 1 })]);
        setEditingHeroIndex(heroSlides.length);
        window.requestAnimationFrame(() => {
            heroEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    const deleteHeroSlide = (index) => {
        setHeroSlides((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
        setEditingHeroIndex((previous) => Math.max(0, Math.min(previous, heroSlides.length - 2)));
    };

    const addCategoryItem = () => {
        setCategoryItems((previous) => [...previous, createCategoryItemForm({ id: previous.length + 1 })]);
        setEditingCategoryIndex(categoryItems.length);
        window.requestAnimationFrame(() => {
            categoryEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    const deleteCategoryItem = (index) => {
        setCategoryItems((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
        setEditingCategoryIndex((previous) => Math.max(0, Math.min(previous, categoryItems.length - 2)));
    };

    const handleReset = async () => {
        try {
            const content = await resetHomeContent();
            setFeaturedCards(content.featuredCards.map(createCardForm));
            setCuratedLooks(content.curatedLooks.map(createCardForm));
            setHeroSlides(content.heroSlides.map(createHeroSlideForm));
            setCategoryItems(content.categoryItems.map(createCategoryItemForm));
            setMessage("Home content reset for all users.");
        } catch (error) {
            setMessage(error.message || "Unable to reset home content for all users.");
        }
    };

    const pageClass = isDark ? "min-h-screen bg-zinc-950 px-4 pb-14 pt-28 text-zinc-100 sm:px-6 lg:px-8" : "min-h-screen bg-zinc-50 px-4 pb-14 pt-28 text-zinc-900 sm:px-6 lg:px-8";
    const cardClass = isDark ? "rounded-[32px] border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/20" : "rounded-[32px] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/60";
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

    const renderHeroSlideFields = (index, slide) => (
        <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Title</span>
                <input value={slide.title} onChange={(event) => updateHeroSlideField(index, "title", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm">
                <span className="font-medium">Subtitle</span>
                <input value={slide.subtitle} onChange={(event) => updateHeroSlideField(index, "subtitle", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm">
                <span className="font-medium">Offer</span>
                <input value={slide.offer} onChange={(event) => updateHeroSlideField(index, "offer", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">CTA Text</span>
                <input value={slide.cta} onChange={(event) => updateHeroSlideField(index, "cta", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Image URL</span>
                <input value={slide.image} onChange={(event) => updateHeroSlideField(index, "image", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Target Page</span>
                <select value={slide.targetPath} onChange={(event) => updateHeroSlideField(index, "targetPath", event.target.value)} className={inputClass}>
                    <option value="/constitutional-edition">Constitutional Edition</option>
                    <option value="/custom-edition">Custom Edition</option>
                </select>
            </label>
        </div>
    );

    const renderCategoryFields = (index, item) => (
        <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Title</span>
                <input value={item.title} onChange={(event) => updateCategoryItemField(index, "title", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Image URL</span>
                <input value={item.image} onChange={(event) => updateCategoryItemField(index, "image", event.target.value)} className={inputClass} />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Target Page</span>
                <select value={item.targetPath} onChange={(event) => updateCategoryItemField(index, "targetPath", event.target.value)} className={inputClass}>
                    <option value="/constitutional-edition">Constitutional Edition</option>
                    <option value="/custom-edition">Custom Edition</option>
                </select>
            </label>
        </div>
    );

    return (
        <main className={pageClass}>
            <section className="mx-auto max-w-7xl space-y-8">
                <div className={isDark ? "rounded-[32px] border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20" : "rounded-[32px] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/70"}>
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600"}>
                                Admin workspace
                            </p>
                            <h1 className="mt-3 text-4xl font-black sm:text-5xl">Handle Home</h1>
                            <p className={isDark ? "mt-3 max-w-2xl text-sm leading-7 text-zinc-300" : "mt-3 max-w-2xl text-sm leading-7 text-zinc-600"}>
                                Edit hero slides, category items, featured cards, and the curated looks that appear on the home page.
                            </p>
                        </div>
                        <div className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300" : "rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"}>
                            Signed in as <span className="font-semibold">{user?.fullName}</span>
                        </div>
                    </div>
                </div>

                {message ? (
                    <div className={isDark ? "mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200" : "mb-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"}>
                        {message}
                    </div>
                ) : null}

                <div className="grid gap-6 lg:grid-cols-2 xl:gap-8">
                    <section ref={heroEditorRef} className={cardClass}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Hero slides</p>
                                <h2 className="mt-2 text-2xl font-semibold">Add, edit, delete</h2>
                            </div>
                            <button type="button" onClick={addHeroSlide} className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-white">
                                Add Hero Slide
                            </button>
                        </div>

                        <div className="mt-5 space-y-3">
                            {heroSlides.map((slide, index) => (
                                <div key={`${slide.id || index}`} className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4" : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4"}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold">{slide.title || `Slide ${index + 1}`}</p>
                                            <p className={isDark ? "text-xs text-zinc-400" : "text-xs text-zinc-600"}>{slide.targetPath === "/custom-edition" ? "Custom Edition" : "Constitutional Edition"}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => openHeroEditor(index)} className={editingHeroIndex === index ? "rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white" : "rounded-full border border-cyan-500 px-3 py-1 text-xs font-semibold text-cyan-500"}>
                                                Edit
                                            </button>
                                            <button type="button" onClick={() => deleteHeroSlide(index)} className="rounded-full border border-red-400 px-3 py-1 text-xs font-semibold text-red-500">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {heroSlides[editingHeroIndex] ? (
                            <div className={isDark ? "mt-5 rounded-3xl border border-zinc-800 bg-zinc-950 p-4" : "mt-5 rounded-3xl border border-zinc-200 bg-zinc-50 p-4"}>
                                <p className="text-sm font-semibold">Editing Slide {editingHeroIndex + 1}</p>
                                <div className="mt-4">
                                    {renderHeroSlideFields(editingHeroIndex, heroSlides[editingHeroIndex])}
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-5 flex flex-wrap gap-3">
                            <button type="button" onClick={saveHeroSlides} className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
                                Save Hero Slides
                            </button>
                        </div>
                    </section>

                    <section ref={categoryEditorRef} className={cardClass}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Category items</p>
                                <h2 className="mt-2 text-2xl font-semibold">Add, edit, delete</h2>
                            </div>
                            <button type="button" onClick={addCategoryItem} className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-white">
                                Add Category Item
                            </button>
                        </div>

                        <div className="mt-5 space-y-3">
                            {categoryItems.map((item, index) => (
                                <div key={`${item.id || index}`} className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4" : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4"}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold">{item.title || `Item ${index + 1}`}</p>
                                            <p className={isDark ? "text-xs text-zinc-400" : "text-xs text-zinc-600"}>{item.targetPath === "/custom-edition" ? "Custom Edition" : "Constitutional Edition"}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => openCategoryEditor(index)} className={editingCategoryIndex === index ? "rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white" : "rounded-full border border-cyan-500 px-3 py-1 text-xs font-semibold text-cyan-500"}>
                                                Edit
                                            </button>
                                            <button type="button" onClick={() => deleteCategoryItem(index)} className="rounded-full border border-red-400 px-3 py-1 text-xs font-semibold text-red-500">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {categoryItems[editingCategoryIndex] ? (
                            <div className={isDark ? "mt-5 rounded-3xl border border-zinc-800 bg-zinc-950 p-4" : "mt-5 rounded-3xl border border-zinc-200 bg-zinc-50 p-4"}>
                                <p className="text-sm font-semibold">Editing Category Item {editingCategoryIndex + 1}</p>
                                <div className="mt-4">
                                    {renderCategoryFields(editingCategoryIndex, categoryItems[editingCategoryIndex])}
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-5 flex flex-wrap gap-3">
                            <button type="button" onClick={saveCategoryItems} className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
                                Save Category Items
                            </button>
                        </div>
                    </section>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] xl:gap-8">
                    <section className={cardClass}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Featured cards</p>
                                <h2 className="mt-2 text-2xl font-semibold">On-Trend and Popular Tee</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => navigate("/admin")} className={isDark ? "rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700"}>
                                    Back to Admin
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            {featuredCards.map((card, index) => (
                                <div key={card.id || card.title || index} className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4" : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4"}>
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold">{card.title || `Featured Card ${index + 1}`}</p>
                                        <button
                                            type="button"
                                            onClick={() => deleteCard("featured", card.id)}
                                            className="rounded-full border border-red-400 px-3 py-1 text-xs font-semibold text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="mt-4">{renderProductFields("featured", index, card)}</div>
                                </div>
                            ))}

                            {!featuredCards.length ? (
                                <div className={isDark ? "rounded-2xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400" : "rounded-2xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500"}>
                                    No featured cards are configured.
                                </div>
                            ) : null}

                            <div className="rounded-2xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
                                <p className="text-sm font-semibold">Curated Looks</p>
                                <p className={isDark ? "text-xs text-zinc-400" : "text-xs text-zinc-500"}>Five products are shown in the carousel below the featured cards.</p>

                                <div className="mt-4 space-y-6">
                                    {curatedLooks.map((card, index) => (
                                        <div key={card.id || card.title || index} className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4" : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4"}>
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold">{card.title || `Look ${index + 1}`}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteCard("curated", card.id)}
                                                    className="rounded-full border border-red-400 px-3 py-1 text-xs font-semibold text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <div className="mt-4">
                                                {renderProductFields("curated", index, card)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {!curatedLooks.length ? (
                                    <div className={isDark ? "mt-4 rounded-2xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400" : "mt-4 rounded-2xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500"}>
                                        No curated looks are configured.
                                    </div>
                                ) : null}

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button type="button" onClick={saveCuratedLooks} className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
                                        Save Curated Looks
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button type="submit" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
                                    Save Featured Cards
                                </button>
                                <button type="button" onClick={handleReset} className={isDark ? "rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700"}>
                                    Reset Home Content
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className={`${cardClass} lg:sticky lg:top-28 self-start`}>
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