import { fetchSiteContent, updateSiteContent } from "./api";

const STORAGE_KEY = "kc-contact-settings-v1";
const SYNC_INTERVAL_MS = 15000;

const defaultContactSettings = {
    pageTitle: "Contact Us",
    pageDescription: "Reach out for order help, product questions, sizing support, or partnership inquiries. Our team usually responds within one business day.",
    supportLine: "We are here to help",
    email: "support@trialbytshirt.com",
    phone: "+91 8667015665",
    whatsapp: "+91 8667015665",
    workingHours: "Mon - Sat, 9:00 AM - 7:00 PM",
    address: "Chennai, Tamil Nadu, India",
    responseNote: "Use the profile page for order tracking and cart details, or go back to shopping for more products.",
};

const hasWindow = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
let lastSyncedAt = 0;
let syncPromise = null;

const normalizeContactSettings = (value = {}) => ({
    ...defaultContactSettings,
    ...value,
    pageTitle: String(value?.pageTitle || defaultContactSettings.pageTitle).trim(),
    pageDescription: String(value?.pageDescription || defaultContactSettings.pageDescription).trim(),
    supportLine: String(value?.supportLine || defaultContactSettings.supportLine).trim(),
    email: String(value?.email || defaultContactSettings.email).trim(),
    phone: String(value?.phone || defaultContactSettings.phone).trim(),
    whatsapp: String(value?.whatsapp || defaultContactSettings.whatsapp).trim(),
    workingHours: String(value?.workingHours || defaultContactSettings.workingHours).trim(),
    address: String(value?.address || defaultContactSettings.address).trim(),
    responseNote: String(value?.responseNote || defaultContactSettings.responseNote).trim(),
});

const readContactSettings = () => {
    if (!hasWindow()) {
        return normalizeContactSettings();
    }

    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
        const settings = normalizeContactSettings();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        return settings;
    }

    try {
        return normalizeContactSettings(JSON.parse(rawValue));
    } catch {
        const settings = normalizeContactSettings();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        return settings;
    }
};

const writeContactSettings = (settings) => {
    if (!hasWindow()) {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeContactSettings(settings)));
    window.dispatchEvent(new Event("kc-contact-changed"));
};

export const getContactSettings = () => {
    void syncContactSettingsFromServer();
    return readContactSettings();
};

export const syncContactSettingsFromServer = async (force = false) => {
    if (!hasWindow()) {
        return readContactSettings();
    }

    const now = Date.now();
    if (!force && now - lastSyncedAt < SYNC_INTERVAL_MS) {
        return readContactSettings();
    }

    if (syncPromise) {
        return syncPromise;
    }

    syncPromise = (async () => {
        try {
            const serverContent = await fetchSiteContent("contact");
            const merged = normalizeContactSettings(serverContent);
            writeContactSettings(merged);
            lastSyncedAt = Date.now();
            return merged;
        } catch {
            return readContactSettings();
        } finally {
            syncPromise = null;
        }
    })();

    return syncPromise;
};

export const updateContactSettings = async (updates, tokenOverride) => {
    const currentSettings = readContactSettings();
    const nextSettings = normalizeContactSettings({
        ...currentSettings,
        ...updates,
    });
    writeContactSettings(nextSettings);
    const token = tokenOverride || (hasWindow() ? window.localStorage.getItem("authToken") : null);
    const persisted = await updateSiteContent("contact", nextSettings, token);
    writeContactSettings(normalizeContactSettings(persisted));
    lastSyncedAt = Date.now();
    return normalizeContactSettings(persisted);
};

export const resetContactSettings = async (tokenOverride) => {
    const settings = normalizeContactSettings();
    return updateContactSettings(settings, tokenOverride);
};

export const contactSettingsDefaults = defaultContactSettings;