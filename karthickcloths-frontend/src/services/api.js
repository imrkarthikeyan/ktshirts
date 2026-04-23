const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? "http://localhost:8080/api" : "https://ktshirts.onrender.com/api");

export { API_BASE_URL };

const hasOnlineImageUrl = (url) => typeof url === "string" && /^https?:\/\//i.test(url);

const getTempImages = (seed) => [
    `https://picsum.photos/seed/kc-${seed}-1/900/1200`,
    `https://picsum.photos/seed/kc-${seed}-2/900/1200`,
    `https://picsum.photos/seed/kc-${seed}-3/900/1200`,
    `https://picsum.photos/seed/kc-${seed}-4/900/1200`,
];

const normalizeProductImages = (product, index = 0) => {
    const seed = product?.id ?? `product-${index}`;
    const apiImages = Array.isArray(product?.images)
        ? product.images.filter(hasOnlineImageUrl)
        : [];

    if (apiImages.length > 0) {
        return { ...product, images: apiImages };
    }

    if (hasOnlineImageUrl(product?.imageUrl)) {
        return {
            ...product,
            images: [product.imageUrl, ...getTempImages(`${seed}-extra`).slice(0, 3)],
        };
    }

    return {
        ...product,
        images: getTempImages(seed),
    };
};

const normalizeProductList = (data) =>
    Array.isArray(data) ? data.map((product, index) => normalizeProductImages(product, index)) : [];

export async function fetchMenProducts() {
    const response = await fetch(`${API_BASE_URL}/products/men`);
    if (!response.ok) {
        throw new Error("Unable to fetch men products");
    }
    const data = await response.json();
    return normalizeProductList(data);
}

export async function fetchMenProductById(productId) {
    const response = await fetch(`${API_BASE_URL}/products/men/${productId}`);
    if (!response.ok) {
        throw new Error("Unable to fetch product details");
    }
    const data = await response.json();
    return normalizeProductImages(data);
}

export async function fetchWomenProducts() {
    const response = await fetch(`${API_BASE_URL}/products/women`);
    if (!response.ok) {
        throw new Error("Unable to fetch women products");
    }
    const data = await response.json();
    return normalizeProductList(data);
}

export async function fetchWomenProductById(productId) {
    const response = await fetch(`${API_BASE_URL}/products/women/${productId}`);
    if (!response.ok) {
        throw new Error("Unable to fetch women product details");
    }
    const data = await response.json();
    return normalizeProductImages(data);
}

export async function fetchKidsProducts() {
    const response = await fetch(`${API_BASE_URL}/products/kids`);
    if (!response.ok) {
        throw new Error("Unable to fetch kids products");
    }
    const data = await response.json();
    return normalizeProductList(data);
}

export async function fetchKidsProductById(productId) {
    const response = await fetch(`${API_BASE_URL}/products/kids/${productId}`);
    if (!response.ok) {
        throw new Error("Unable to fetch kids product details");
    }
    const data = await response.json();
    return normalizeProductImages(data);
}

export async function createWhatsappOrderLink(payload) {
    const response = await fetch(`${API_BASE_URL}/orders/whatsapp-link`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Unable to create WhatsApp order");
    }

    return response.json();
}
