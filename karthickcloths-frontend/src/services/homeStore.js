import { fetchSiteContent, updateSiteContent } from "./api";

const STORAGE_KEY = "kc-home-content-v1";
const SYNC_INTERVAL_MS = 15000;

const makeProduct = (product) => ({
    id: Number(product.id),
    name: String(product.name || "").trim(),
    brand: String(product.brand || "TRIAL BY TSHIRT").trim(),
    description: String(product.description || "").trim(),
    originalPrice: Number(product.originalPrice) || 0,
    offerPrice: Number(product.offerPrice) || 0,
    discountPercent: Number(product.discountPercent) || 0,
    defaultColor: String(product.defaultColor || "Black").trim(),
    availableColors: Array.isArray(product.availableColors) ? product.availableColors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    sleeve: String(product.sleeve || "Half Sleeve").trim(),
    seller: String(product.seller || "TRIAL BY TSHIRT STORE").trim(),
    deliveryBy: String(product.deliveryBy || "30 Apr, Thu").trim(),
    sellerRating: Number(product.sellerRating) || 4.4,
    ratingText: String(product.ratingText || "Home Edit").trim(),
    images: Array.isArray(product.images) ? product.images.slice(0, 4) : [],
});

const defaultHeroSlide = (slide) => ({
    id: Number(slide.id),
    title: String(slide.title || "").trim(),
    subtitle: String(slide.subtitle || "").trim(),
    offer: String(slide.offer || "").trim(),
    cta: String(slide.cta || "SHOP NOW").trim(),
    image: String(slide.image || "").trim(),
    targetPath: String(slide.targetPath || "/constitutional-edition").trim(),
});

const defaultCategoryItem = (item) => ({
    id: Number(item.id),
    title: String(item.title || "").trim(),
    image: String(item.image || "").trim(),
    targetPath: String(item.targetPath || "/constitutional-edition").trim(),
    hidden: Boolean(item.hidden),
});

const defaultHomeContent = {
    heroSlides: [
        defaultHeroSlide({
            id: 1,
            title: "Denim",
            subtitle: "Dreams",
            offer: "Up To 50% Off",
            cta: "SHOP NOW",
            image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1900&q=80",
            targetPath: "/constitutional-edition",
        }),
        defaultHeroSlide({
            id: 2,
            title: "Perfectly",
            subtitle: "Suited",
            offer: "Premium Workwear Edit",
            cta: "SHOP WORKWEAR",
            image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1900&q=80",
            targetPath: "/custom-edition",
        }),
        defaultHeroSlide({
            id: 3,
            title: "Urban",
            subtitle: "Basics",
            offer: "Fresh Fits For Every Day",
            cta: "SHOP CASUAL",
            image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1900&q=80",
            targetPath: "/constitutional-edition",
        }),
        defaultHeroSlide({
            id: 4,
            title: "Summer",
            subtitle: "Cottons",
            offer: "Breezy Looks Starting Today",
            cta: "SHOP NOW",
            image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1900&q=80",
            targetPath: "/custom-edition",
        }),
        defaultHeroSlide({
            id: 5,
            title: "Street",
            subtitle: "Culture",
            offer: "New Drop Just Landed",
            cta: "EXPLORE MORE",
            image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1900&q=80",
            targetPath: "/constitutional-edition",
        }),
        defaultHeroSlide({
            id: 6,
            title: "Bold",
            subtitle: "Essentials",
            offer: "Everyday Must Haves",
            cta: "SHOP DAILY",
            image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1900&q=80",
            targetPath: "/custom-edition",
        }),
    ],
    categoryItems: [
        defaultCategoryItem({
            id: 1,
            title: "SS26",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80",
            targetPath: "/constitutional-edition",
        }),
        defaultCategoryItem({
            id: 2,
            title: "Women",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
            targetPath: "/custom-edition",
        }),
        defaultCategoryItem({
            id: 3,
            title: "Men",
            image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=700&q=80",
            targetPath: "/constitutional-edition",
        }),
        defaultCategoryItem({
            id: 4,
            title: "Kids",
            image: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=700&q=80",
            targetPath: "/custom-edition",
        }),
        defaultCategoryItem({
            id: 5,
            title: "WROGN",
            image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=700&q=80",
            targetPath: "/constitutional-edition",
        }),
        defaultCategoryItem({
            id: 6,
            title: "Footwear",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
            targetPath: "/custom-edition",
        }),
        defaultCategoryItem({
            id: 7,
            title: "Beauty",
            image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=700&q=80",
            targetPath: "/constitutional-edition",
        }),
    ],
    featuredCards: [
        {
            id: 1,
            title: "On-Trend",
            subtitle: "Fresh styles for modern elegance for women",
            image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80",
            product: makeProduct({
                id: 1,
                name: "On-Trend",
                brand: "TRIAL BY TSHIRT",
                description: "Modern silhouettes with a refined finish for day-to-night dressing.",
                originalPrice: 1499,
                offerPrice: 899,
                discountPercent: 40,
                defaultColor: "Black",
                availableColors: ["Black", "Ivory", "Dusty Pink"],
                sizes: ["S", "M", "L", "XL"],
                sleeve: "Half Sleeve",
                seller: "TRIAL BY TSHIRT STORE",
                deliveryBy: "30 Apr, Thu",
                sellerRating: 4.5,
                ratingText: "Home Edit",
                images: [
                    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80",
                ],
            }),
        },
        {
            id: 2,
            title: "Popular Tee",
            subtitle: "Sport-inspired styles with street attitude",
            image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
            product: makeProduct({
                id: 2,
                name: "Popular Tee",
                brand: "TRIAL BY TSHIRT",
                description: "An easy everyday tee shaped for relaxed styling and repeat wear.",
                originalPrice: 1299,
                offerPrice: 749,
                discountPercent: 42,
                defaultColor: "White",
                availableColors: ["White", "Navy", "Grey"],
                sizes: ["M", "L", "XL", "2XL"],
                sleeve: "Half Sleeve",
                seller: "TRIAL BY TSHIRT STORE",
                deliveryBy: "30 Apr, Thu",
                sellerRating: 4.4,
                ratingText: "Home Edit",
                images: [
                    "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=900&q=80",
                ],
            }),
        },
    ],
    curatedLooks: [
        {
            id: 3,
            title: "Elegant",
            subtitle: "Summer Vibes",
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
            product: makeProduct({
                id: 3,
                name: "Elegant Summer Vibes",
                brand: "TRIAL BY TSHIRT",
                description: "A light and polished look for warm-weather dressing.",
                originalPrice: 1399,
                offerPrice: 799,
                discountPercent: 43,
                defaultColor: "Sand",
                availableColors: ["Sand", "White", "Olive"],
                sizes: ["S", "M", "L", "XL"],
                sleeve: "Half Sleeve",
                seller: "TRIAL BY TSHIRT STORE",
                deliveryBy: "01 May, Fri",
                sellerRating: 4.3,
                ratingText: "Curated Looks",
                images: [
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1583743814966-8936f37f4f4f?auto=format&fit=crop&w=800&q=80",
                ],
            }),
        },
        {
            id: 4,
            title: "Premium",
            subtitle: "Workwear Essentials",
            image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1900&q=80",
            product: makeProduct({
                id: 4,
                name: "Premium Workwear Essentials",
                brand: "TRIAL BY TSHIRT",
                description: "Clean, elevated workwear that feels sharp without trying too hard.",
                originalPrice: 1699,
                offerPrice: 999,
                discountPercent: 41,
                defaultColor: "Navy",
                availableColors: ["Navy", "Grey", "White"],
                sizes: ["M", "L", "XL", "2XL"],
                sleeve: "Full Sleeve",
                seller: "TRIAL BY TSHIRT STORE",
                deliveryBy: "01 May, Fri",
                sellerRating: 4.5,
                ratingText: "Curated Looks",
                images: [
                    "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1900&q=80",
                    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1900&q=80",
                    "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1900&q=80",
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1900&q=80",
                ],
            }),
        },
        {
            id: 5,
            title: "Casual",
            subtitle: "Street Style",
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
            product: makeProduct({
                id: 5,
                name: "Casual Street Style",
                brand: "TRIAL BY TSHIRT",
                description: "Street-ready styling with a relaxed everyday fit.",
                originalPrice: 1199,
                offerPrice: 699,
                discountPercent: 42,
                defaultColor: "Charcoal",
                availableColors: ["Charcoal", "White", "Olive"],
                sizes: ["S", "M", "L", "XL"],
                sleeve: "Half Sleeve",
                seller: "TRIAL BY TSHIRT STORE",
                deliveryBy: "02 May, Sat",
                sellerRating: 4.2,
                ratingText: "Curated Looks",
                images: [
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80",
                ],
            }),
        },
        {
            id: 6,
            title: "Sporty",
            subtitle: "Athletic Wear",
            image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1900&q=80",
            product: makeProduct({
                id: 6,
                name: "Sporty Athletic Wear",
                brand: "TRIAL BY TSHIRT",
                description: "Clean athletic styling for active days and easy movement.",
                originalPrice: 1499,
                offerPrice: 849,
                discountPercent: 43,
                defaultColor: "Black",
                availableColors: ["Black", "Grey", "Blue"],
                sizes: ["M", "L", "XL", "2XL"],
                sleeve: "Half Sleeve",
                seller: "TRIAL BY TSHIRT STORE",
                deliveryBy: "02 May, Sat",
                sellerRating: 4.4,
                ratingText: "Curated Looks",
                images: [
                    "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1900&q=80",
                    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1900&q=80",
                    "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1900&q=80",
                    "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1900&q=80",
                ],
            }),
        },
        {
            id: 7,
            title: "Evening",
            subtitle: "Formal Collection",
            image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1900&q=80",
            product: makeProduct({
                id: 7,
                name: "Evening Formal Collection",
                brand: "TRIAL BY TSHIRT",
                description: "Polished evening looks with a structured, premium finish.",
                originalPrice: 1599,
                offerPrice: 949,
                discountPercent: 41,
                defaultColor: "White",
                availableColors: ["White", "Black", "Sand"],
                sizes: ["M", "L", "XL", "2XL"],
                sleeve: "Half Sleeve",
                seller: "TRIAL BY TSHIRT STORE",
                deliveryBy: "03 May, Sun",
                sellerRating: 4.6,
                ratingText: "Curated Looks",
                images: [
                    "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1900&q=80",
                    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1900&q=80",
                    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1900&q=80",
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1900&q=80",
                ],
            }),
        },
    ],
};

const hasWindow = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
let lastSyncedAt = 0;
let syncPromise = null;

const normalizeHomeContent = (value = {}) => {
    const heroSlides = Array.isArray(value.heroSlides) && value.heroSlides.length > 0
        ? value.heroSlides.map((slide, index) => ({
            ...defaultHomeContent.heroSlides[index % defaultHomeContent.heroSlides.length],
            ...slide,
            id: Number(slide.id) || index + 1,
            targetPath: String(slide.targetPath || slide.target || "/constitutional-edition").trim(),
        }))
        : defaultHomeContent.heroSlides;

    const categoryItems = Array.isArray(value.categoryItems) && value.categoryItems.length > 0
        ? value.categoryItems.map((item, index) => ({
            ...defaultHomeContent.categoryItems[index % defaultHomeContent.categoryItems.length],
            ...item,
            id: Number(item.id) || index + 1,
            targetPath: String(item.targetPath || item.target || "/constitutional-edition").trim(),
            hidden: Boolean(item.hidden),
        }))
        : defaultHomeContent.categoryItems;

    const featuredCards = Array.isArray(value.featuredCards)
        ? value.featuredCards.map((card, index) => ({
            ...defaultHomeContent.featuredCards[index % defaultHomeContent.featuredCards.length],
            ...card,
            id: Number(card.id) || defaultHomeContent.featuredCards[index % defaultHomeContent.featuredCards.length].id,
            hidden: Boolean(card.hidden),
            product: makeProduct({ ...defaultHomeContent.featuredCards[index % defaultHomeContent.featuredCards.length].product, ...(card.product || {}), id: Number(card.product?.id) || Number(card.id) || defaultHomeContent.featuredCards[index % defaultHomeContent.featuredCards.length].id }),
        }))
        : defaultHomeContent.featuredCards;

    const curatedLooks = Array.isArray(value.curatedLooks)
        ? value.curatedLooks.map((card, index) => ({
            ...defaultHomeContent.curatedLooks[index % defaultHomeContent.curatedLooks.length],
            ...card,
            id: Number(card.id) || defaultHomeContent.curatedLooks[index % defaultHomeContent.curatedLooks.length].id,
            hidden: Boolean(card.hidden),
            product: makeProduct({ ...defaultHomeContent.curatedLooks[index % defaultHomeContent.curatedLooks.length].product, ...(card.product || {}), id: Number(card.product?.id) || Number(card.id) || defaultHomeContent.curatedLooks[index % defaultHomeContent.curatedLooks.length].id }),
        }))
        : defaultHomeContent.curatedLooks;

    return {
        heroSlides,
        categoryItems,
        featuredCards,
        curatedLooks,
    };
};

const readHomeContent = () => {
    if (!hasWindow()) {
        return normalizeHomeContent();
    }

    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
        const content = normalizeHomeContent();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        return content;
    }

    try {
        return normalizeHomeContent(JSON.parse(rawValue));
    } catch {
        const content = normalizeHomeContent();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        return content;
    }
};

const writeHomeContent = (content) => {
    if (!hasWindow()) {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeHomeContent(content)));
    window.dispatchEvent(new Event("kc-home-content-changed"));
};

export const getHomeContent = () => {
    void syncHomeContentFromServer();
    return readHomeContent();
};

export const syncHomeContentFromServer = async (force = false) => {
    if (!hasWindow()) {
        return readHomeContent();
    }

    const now = Date.now();
    if (!force && now - lastSyncedAt < SYNC_INTERVAL_MS) {
        return readHomeContent();
    }

    if (syncPromise) {
        return syncPromise;
    }

    syncPromise = (async () => {
        try {
            const serverContent = await fetchSiteContent("home");
            const merged = normalizeHomeContent(serverContent);
            writeHomeContent(merged);
            lastSyncedAt = Date.now();
            return merged;
        } catch {
            return readHomeContent();
        } finally {
            syncPromise = null;
        }
    })();

    return syncPromise;
};

export const updateHomeContent = async (updates, tokenOverride) => {
    const currentContent = readHomeContent();
    const nextContent = normalizeHomeContent({
        ...currentContent,
        ...updates,
        featuredCards: updates?.featuredCards || currentContent.featuredCards,
        curatedLooks: updates?.curatedLooks || currentContent.curatedLooks,
    });

    writeHomeContent(nextContent);

    const token = tokenOverride || (hasWindow() ? window.localStorage.getItem("authToken") : null);
    const persisted = await updateSiteContent("home", nextContent, token);
    writeHomeContent(normalizeHomeContent(persisted));
    lastSyncedAt = Date.now();
    return normalizeHomeContent(persisted);
};

export const resetHomeContent = async (tokenOverride) => {
    const content = normalizeHomeContent();
    return updateHomeContent(content, tokenOverride);
};

export const homeContentDefaults = defaultHomeContent;

export const getHomeProductById = (productId) => {
    const homeContent = readHomeContent();
    const numericProductId = Number(productId);
    const allProducts = [...homeContent.featuredCards, ...homeContent.curatedLooks].map((card) => ({
        ...card.product,
        title: card.title,
        subtitle: card.subtitle,
        image: card.image,
    }));

    return allProducts.find((product) => Number(product.id) === numericProductId) || null;
};