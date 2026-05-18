import { menProductsFallback } from "../pages/MenSection/menProductsData";
import { womenProductsFallback } from "../pages/WomenSection/womenProductsData";
import { kidsProductsFallback } from "../pages/KidsSection/kidsProductsData";
import { constitutionalProductsFallback } from "../pages/ConstitutionalEdition/constitutionalProductsData";

const STORAGE_KEY = "kc-admin-catalog-v1";

const fallbackCatalog = {
    men: menProductsFallback,
    women: womenProductsFallback,
    kids: kidsProductsFallback,
    constitutional: constitutionalProductsFallback,
};

const categoryRoutes = {
    men: (productId) => `/men/${productId}/details`,
    women: (productId) => `/women/${productId}/details`,
    kids: (productId) => `/kids/${productId}/details`,
    constitutional: (productId) => `/constitutional-edition/${productId}/details`,
};

const hasWindow = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const normalizeList = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

const normalizeImages = (images = []) => normalizeList(images).slice(0, 5);

const normalizeProduct = (product, category) => {
    const resolvedCategory = category || product.category;
    const id = Number(product.id);

    return {
        ...product,
        id,
        category: resolvedCategory,
        route: categoryRoutes[resolvedCategory]?.(id) || product.route || "#",
        images: normalizeImages(product.images),
        availableColors: normalizeList(product.availableColors),
        sizes: normalizeList(product.sizes),
        availability: product.availability || "In stock",
        originalPrice: Number(product.originalPrice) || 0,
        offerPrice: Number(product.offerPrice) || 0,
        discountPercent: Number(product.discountPercent) || 0,
        sellerRating: Number(product.sellerRating) || 0,
    };
};

const seedCatalog = () => ({
    men: menProductsFallback.map((product) => normalizeProduct({ ...product, category: "men" }, "men")),
    women: womenProductsFallback.map((product) => normalizeProduct({ ...product, category: "women" }, "women")),
    kids: kidsProductsFallback.map((product) => normalizeProduct({ ...product, category: "kids" }, "kids")),
    constitutional: constitutionalProductsFallback.map((product) => normalizeProduct({ ...product, category: "constitutional" }, "constitutional")),
});

const readCatalog = () => {
    if (!hasWindow()) {
        return seedCatalog();
    }

    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
        const catalog = seedCatalog();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
        return catalog;
    }

    try {
        const parsed = JSON.parse(rawValue);
        const catalog = seedCatalog();

        ["men", "women", "kids", "constitutional"].forEach((category) => {
            if (Array.isArray(parsed?.[category]) && parsed[category].length > 0) {
                catalog[category] = parsed[category].map((product) => normalizeProduct(product, category));
            }
        });

        return catalog;
    } catch {
        const catalog = seedCatalog();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
        return catalog;
    }
};

const writeCatalog = (catalog) => {
    if (!hasWindow()) {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
    window.dispatchEvent(new Event("kc-catalog-changed"));
};

export const getCatalogProducts = (category) => {
    const catalog = readCatalog();
    return (catalog[category] || []).map((product) => normalizeProduct(product, category));
};

export const getCatalogProductById = (category, productId) =>
    getCatalogProducts(category).find((product) => Number(product.id) === Number(productId)) || null;

export const getNextCatalogProductId = (category) => {
    const products = getCatalogProducts(category);
    const highestId = products.reduce((maxId, product) => Math.max(maxId, Number(product.id) || 0), 0);
    return highestId + 1;
};

export const upsertCatalogProduct = (category, product) => {
    const catalog = readCatalog();
    const nextProduct = normalizeProduct(
        {
            ...product,
            id: product.id ? Number(product.id) : getNextCatalogProductId(category),
            category,
        },
        category
    );

    const currentProducts = Array.isArray(catalog[category]) ? catalog[category] : [];
    const existingIndex = currentProducts.findIndex((item) => Number(item.id) === Number(nextProduct.id));

    if (existingIndex >= 0) {
        currentProducts[existingIndex] = nextProduct;
    } else {
        currentProducts.push(nextProduct);
    }

    catalog[category] = currentProducts.sort((left, right) => Number(left.id) - Number(right.id));
    writeCatalog(catalog);

    return nextProduct;
};

export const deleteCatalogProduct = (category, productId) => {
    const catalog = readCatalog();
    catalog[category] = (catalog[category] || []).filter((product) => Number(product.id) !== Number(productId));
    writeCatalog(catalog);
};

export const replaceCatalogProducts = (category, products) => {
    const catalog = readCatalog();
    catalog[category] = products.map((product) => normalizeProduct(product, category));
    writeCatalog(catalog);
};

export const getAllCatalogProducts = () => [
    // ...getCatalogProducts("men"),
    // ...getCatalogProducts("women"),
    // ...getCatalogProducts("kids"),
    ...getCatalogProducts("constitutional"),
];

export const catalogCategoryMeta = {
    men: { label: "Men Wear", routePrefix: "/men" },
    women: { label: "Women Wear", routePrefix: "/women" },
    kids: { label: "Kids Wear", routePrefix: "/kids" },
    constitutional: { label: "Constitutional Tees", routePrefix: "/constitutional-edition" },
};