import { fetchSiteContent, updateSiteContent } from "./api";

const STORAGE_KEY = "kc-footer-settings-v1";
const SYNC_INTERVAL_MS = 15000;

const defaultFooterSettings = {
    brandName: "TRIAL BY TSHIRT",
    tagline: "Everyday essentials and elevated fashion for men, women, and kids. Designed for comfort, crafted for style.",
    gstin: "33ABCDE1234F1Z5",
    locations: [
        {
            label: "Main Store",
            address: "No. 24, Bazaar Street, Erode, Tamil Nadu - 638001",
        },
        {
            label: "Warehouse",
            address: "SIPCOT Road, Perundurai, Tamil Nadu - 638052",
        },
    ],
    contactDetails: {
        phone: "+91 8667015665",
        whatsapp: "+91 8667015665",
        email: "support@trialbytshirt.com",
        workingHours: "Mon-Sat, 9:30 AM to 8:30 PM",
    },
    copyrightText: "2026 TRIAL BY TSHIRT. All rights reserved.",
};

const hasWindow = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
let lastSyncedAt = 0;
let syncPromise = null;

const normalizeLocations = (locations) => {
    if (!Array.isArray(locations) || locations.length === 0) {
        return [...defaultFooterSettings.locations];
    }

    return locations
        .map((location) => ({
            label: String(location?.label || "").trim(),
            address: String(location?.address || "").trim(),
        }))
        .filter((location) => location.label || location.address);
};

const normalizeFooterSettings = (value = {}) => ({
    ...defaultFooterSettings,
    ...value,
    tagline: String(value?.tagline || defaultFooterSettings.tagline).trim(),
    gstin: String(value?.gstin || defaultFooterSettings.gstin).trim(),
    copyrightText: String(value?.copyrightText || defaultFooterSettings.copyrightText).trim(),
    locations: normalizeLocations(value?.locations),
    contactDetails: {
        ...defaultFooterSettings.contactDetails,
        ...(value?.contactDetails || {}),
    },
});

const readFooterSettings = () => {
    if (!hasWindow()) {
        return normalizeFooterSettings();
    }

    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
        const settings = normalizeFooterSettings();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        return settings;
    }

    try {
        return normalizeFooterSettings(JSON.parse(rawValue));
    } catch {
        const settings = normalizeFooterSettings();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        return settings;
    }
};

const writeFooterSettings = (settings) => {
    if (!hasWindow()) {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeFooterSettings(settings)));
    window.dispatchEvent(new Event("kc-footer-changed"));
};

export const getFooterSettings = () => {
    void syncFooterSettingsFromServer();
    return readFooterSettings();
};

export const syncFooterSettingsFromServer = async (force = false) => {
    if (!hasWindow()) {
        return readFooterSettings();
    }

    const now = Date.now();
    if (!force && now - lastSyncedAt < SYNC_INTERVAL_MS) {
        return readFooterSettings();
    }

    if (syncPromise) {
        return syncPromise;
    }

    syncPromise = (async () => {
        try {
            const serverContent = await fetchSiteContent("footer");
            const merged = normalizeFooterSettings(serverContent);
            writeFooterSettings(merged);
            lastSyncedAt = Date.now();
            return merged;
        } catch {
            return readFooterSettings();
        } finally {
            syncPromise = null;
        }
    })();

    return syncPromise;
};

export const updateFooterSettings = async (updates, tokenOverride) => {
    const currentSettings = readFooterSettings();
    const nextSettings = normalizeFooterSettings({
        ...currentSettings,
        ...updates,
        contactDetails: {
            ...currentSettings.contactDetails,
            ...(updates?.contactDetails || {}),
        },
    });

    writeFooterSettings(nextSettings);

    const token = tokenOverride || (hasWindow() ? window.localStorage.getItem("authToken") : null);
    const persisted = await updateSiteContent("footer", nextSettings, token);
    writeFooterSettings(normalizeFooterSettings(persisted));
    lastSyncedAt = Date.now();
    return normalizeFooterSettings(persisted);
};

export const resetFooterSettings = async (tokenOverride) => {
    const settings = normalizeFooterSettings();
    return updateFooterSettings(settings, tokenOverride);
};

export const footerSettingsDefaults = defaultFooterSettings;