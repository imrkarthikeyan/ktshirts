import { fetchSiteContent, updateSiteContent } from "./api";

const STORAGE_KEY = "kc-about-content-v1";
const SYNC_INTERVAL_MS = 15000;

const defaultAboutContent = {
    title: "About Karthick Cloths",
    heroImage: "https://images.unsplash.com/photo-1523381140519-7d8db409878d?auto=format&fit=crop&w=1900&q=80",
    missionTitle: "Our Mission",
    missionDescription: "At Karthick Cloths, we believe everyone deserves quality apparel that doesn't compromise on comfort or style. We curate the finest collection of clothing for men, women, and kids, ensuring every piece reflects our commitment to excellence.",

    visionTitle: "Our Vision",
    visionDescription: "To be the go-to destination for fashion-forward individuals seeking premium quality, sustainable fashion choices, and exceptional customer service.",

    values: [
        {
            title: "Quality First",
            description: "We never compromise on the quality of our products. Every item is carefully selected and tested.",
            icon: "✨"
        },
        {
            title: "Customer Satisfaction",
            description: "Your happiness is our priority. We stand behind every purchase with exceptional support.",
            icon: "💝"
        },
        {
            title: "Sustainability",
            description: "We care about our planet and focus on eco-friendly practices in our supply chain.",
            icon: "🌱"
        },
        {
            title: "Innovation",
            description: "We constantly evolve our collections to bring you the latest trends and timeless classics.",
            icon: "🚀"
        }
    ],

    story: "Founded in 2020, Karthick Cloths started with a simple idea: make premium fashion accessible to everyone. What began as a small venture has grown into a trusted brand for thousands of customers across India. Our journey is driven by passion, dedication, and a deep understanding of our customers' needs. Today, we're proud to offer an extensive range of clothing that celebrates individuality and self-expression.",

    teamTitle: "Meet Our Team",
    teamDescription: "Our dedicated team works tirelessly to bring you the best shopping experience.",
};

const hasWindow = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
let lastSyncedAt = 0;
let syncPromise = null;

const normalizeAboutContent = (value = {}) => ({
    ...defaultAboutContent,
    ...value,
    title: String(value?.title || defaultAboutContent.title).trim(),
    heroImage: String(value?.heroImage || defaultAboutContent.heroImage).trim(),
    missionTitle: String(value?.missionTitle || defaultAboutContent.missionTitle).trim(),
    missionDescription: String(value?.missionDescription || defaultAboutContent.missionDescription).trim(),
    visionTitle: String(value?.visionTitle || defaultAboutContent.visionTitle).trim(),
    visionDescription: String(value?.visionDescription || defaultAboutContent.visionDescription).trim(),
    story: String(value?.story || defaultAboutContent.story).trim(),
    teamTitle: String(value?.teamTitle || defaultAboutContent.teamTitle).trim(),
    teamDescription: String(value?.teamDescription || defaultAboutContent.teamDescription).trim(),
    values: Array.isArray(value?.values) ? value.values : defaultAboutContent.values,
});

const readAboutContent = () => {
    if (!hasWindow()) {
        return normalizeAboutContent();
    }

    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
        const content = normalizeAboutContent();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        return content;
    }

    try {
        return normalizeAboutContent(JSON.parse(rawValue));
    } catch {
        const content = normalizeAboutContent();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        return content;
    }
};

const writeAboutContent = (content) => {
    if (!hasWindow()) {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeAboutContent(content)));
    window.dispatchEvent(new Event("kc-about-changed"));
};

export const getAboutContent = () => {
    void syncAboutContentFromServer();
    return readAboutContent();
};

export const syncAboutContentFromServer = async (force = false) => {
    if (!hasWindow()) {
        return readAboutContent();
    }

    const now = Date.now();
    if (!force && syncPromise && lastSyncedAt + SYNC_INTERVAL_MS > now) {
        return syncPromise;
    }

    syncPromise = (async () => {
        try {
            const serverContent = await fetchSiteContent("about");
            writeAboutContent(serverContent);
            return readAboutContent();
        } catch {
            return readAboutContent();
        } finally {
            lastSyncedAt = Date.now();
        }
    })();

    return syncPromise;
};

export const updateAboutContent = async (content, token) => {
    try {
        const normalizedContent = normalizeAboutContent(content);
        await updateSiteContent("about", normalizedContent, token);
        writeAboutContent(normalizedContent);
        return normalizedContent;
    } catch (error) {
        throw error;
    }
};

export const aboutContentDefaults = defaultAboutContent;
