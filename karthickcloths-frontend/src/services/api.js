const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? "http://localhost:8080/api" : "https://ktshirts.onrender.com/api");

export { API_BASE_URL };

export async function fetchMenProducts() {
    const response = await fetch(`${API_BASE_URL}/products/men`);
    if (!response.ok) {
        throw new Error("Unable to fetch men products");
    }
    return response.json();
}

export async function fetchMenProductById(productId) {
    const response = await fetch(`${API_BASE_URL}/products/men/${productId}`);
    if (!response.ok) {
        throw new Error("Unable to fetch product details");
    }
    return response.json();
}

export async function fetchWomenProducts() {
    const response = await fetch(`${API_BASE_URL}/products/women`);
    if (!response.ok) {
        throw new Error("Unable to fetch women products");
    }
    return response.json();
}

export async function fetchWomenProductById(productId) {
    const response = await fetch(`${API_BASE_URL}/products/women/${productId}`);
    if (!response.ok) {
        throw new Error("Unable to fetch women product details");
    }
    return response.json();
}

export async function fetchKidsProducts() {
    const response = await fetch(`${API_BASE_URL}/products/kids`);
    if (!response.ok) {
        throw new Error("Unable to fetch kids products");
    }
    return response.json();
}

export async function fetchKidsProductById(productId) {
    const response = await fetch(`${API_BASE_URL}/products/kids/${productId}`);
    if (!response.ok) {
        throw new Error("Unable to fetch kids product details");
    }
    return response.json();
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
