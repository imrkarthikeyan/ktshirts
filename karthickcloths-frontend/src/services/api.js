// const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL ||
//     (import.meta.env.DEV ? "http://localhost:8080/api" : "https://trailbytshirt.onrender.com/api");
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

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

export async function requestSignupOtp(signupData) {
    const response = await fetch(`${API_BASE_URL}/auth/signup/request-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
    }
    return data;
}

export async function verifySignupOtp(email, otp) {
    const response = await fetch(`${API_BASE_URL}/auth/signup/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
    }
    return data;
}

const getAuthHeaders = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

export async function createCustomEditionRequest(payload, token) {
    const response = await fetch(`${API_BASE_URL}/custom-edition/requests`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Unable to submit custom request");
    }
    return data;
}

export async function trackCustomEditionRequest({ orderId, email }) {
    const query = new URLSearchParams();
    if (orderId) {
        query.set("orderId", orderId);
    }
    if (email) {
        query.set("email", email);
    }

    const response = await fetch(`${API_BASE_URL}/custom-edition/tracking?${query.toString()}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to track custom request");
    }

    return data;
}

export async function fetchMyCustomEditionRequests(token) {
    const response = await fetch(`${API_BASE_URL}/custom-edition/requests/mine`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Unable to fetch your requests");
    }
    return data;
}

export async function fetchAdminCustomEditionRequests(token, status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const response = await fetch(`${API_BASE_URL}/custom-edition/requests/admin${query}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Unable to fetch admin requests");
    }
    return data;
}

export async function respondToCustomEditionRequest(requestId, payload, token) {
    const response = await fetch(`${API_BASE_URL}/custom-edition/requests/${requestId}/respond`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Unable to send admin response");
    }
    return data;
}

export async function convertCustomEditionToCart(orderId, token) {
    const response = await fetch(`${API_BASE_URL}/custom-edition/requests/${orderId}/checkout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Unable to convert request to cart");
    }

    return data;
}

export async function confirmCustomEditionRequest(orderId, token) {
    const response = await fetch(`${API_BASE_URL}/custom-edition/requests/${orderId}/confirm`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Unable to confirm custom request");
    }

    return data;
}

export async function cancelCustomEditionRequest(orderId, token) {
    const response = await fetch(`${API_BASE_URL}/custom-edition/requests/${orderId}/cancel`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Unable to cancel custom request");
    }

    return data;
}

export async function fetchSiteContent(key) {
    const response = await fetch(`${API_BASE_URL}/site-content/${encodeURIComponent(key)}`);
    const data = await response.json();

    if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to fetch site content");
    }

    return data?.data || {};
}

export async function updateSiteContent(key, payload, token) {
    if (!token) {
        throw new Error("Admin token is required to update site content");
    }

    const response = await fetch(`${API_BASE_URL}/site-content/${encodeURIComponent(key)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to update site content");
    }

    return data?.data || payload;
}

