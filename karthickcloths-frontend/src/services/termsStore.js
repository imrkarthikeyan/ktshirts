import { fetchSiteContent, updateSiteContent } from "./api";

const STORAGE_KEY = "kc-terms-content-v1";
const SYNC_INTERVAL_MS = 15000;

const defaultTermsContent = {
    title: "Terms and Conditions",
    lastUpdated: "January 2024",

    sections: [
        {
            id: "agreement",
            title: "1. Agreement to Terms",
            content: "By accessing and using Karthick Cloths website and services, you accept and agree to be bound by and comply with the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
        },
        {
            id: "usage",
            title: "2. Use License",
            content: "Permission is granted to temporarily download one copy of the materials (information or software) on Karthick Cloths website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:\n• Modify or copy the materials\n• Use the materials for any commercial purpose or for any public display\n• Attempt to decompile or reverse engineer any software contained on the website\n• Remove any copyright or other proprietary notations from the materials\n• Transfer the materials to another person or 'mirror' the materials on any other server"
        },
        {
            id: "disclaimer",
            title: "3. Disclaimer",
            content: "The materials on Karthick Cloths website are provided 'as is'. Karthick Cloths makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
        },
        {
            id: "limitations",
            title: "4. Limitations",
            content: "In no event shall Karthick Cloths or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Karthick Cloths website, even if Karthick Cloths or an authorized representative has been notified orally or in writing of the possibility of such damage."
        },
        {
            id: "accuracy",
            title: "5. Accuracy of Materials",
            content: "The materials appearing on Karthick Cloths website could include technical, typographical, or photographic errors. Karthick Cloths does not warrant that any of the materials on its website are accurate, complete, or current. Karthick Cloths may make changes to the materials contained on its website at any time without notice."
        },
        {
            id: "links",
            title: "6. Links",
            content: "Karthick Cloths has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Karthick Cloths of the site. Use of any such linked website is at the user's own risk."
        },
        {
            id: "modifications",
            title: "7. Modifications",
            content: "Karthick Cloths may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service."
        },
        {
            id: "payment",
            title: "8. Payment and Billing",
            content: "All payments must be made at the time of purchase unless otherwise arranged. We accept various payment methods as displayed at checkout. By providing payment information, you represent that you are authorized to make such payment on behalf of yourself or the entity for which you are acting."
        },
        {
            id: "returns",
            title: "9. Returns and Refunds",
            content: "Products can be returned within 30 days of purchase in original condition with tags attached. Refunds will be processed within 7-10 business days after we receive and inspect the returned item. Shipping costs are non-refundable unless the return is due to our error."
        },
        {
            id: "privacy",
            title: "10. Privacy Policy",
            content: "Your use of Karthick Cloths website is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices. By using our website, you consent to our privacy practices."
        }
    ]
};

const hasWindow = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
let lastSyncedAt = 0;
let syncPromise = null;

const normalizeTermsContent = (value = {}) => ({
    ...defaultTermsContent,
    ...value,
    title: String(value?.title || defaultTermsContent.title).trim(),
    lastUpdated: String(value?.lastUpdated || defaultTermsContent.lastUpdated).trim(),
    sections: Array.isArray(value?.sections) ? value.sections : defaultTermsContent.sections,
});

const readTermsContent = () => {
    if (!hasWindow()) {
        return normalizeTermsContent();
    }

    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
        const content = normalizeTermsContent();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        return content;
    }

    try {
        return normalizeTermsContent(JSON.parse(rawValue));
    } catch {
        const content = normalizeTermsContent();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        return content;
    }
};

const writeTermsContent = (content) => {
    if (!hasWindow()) {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeTermsContent(content)));
    window.dispatchEvent(new Event("kc-terms-changed"));
};

export const getTermsContent = () => {
    void syncTermsContentFromServer();
    return readTermsContent();
};

export const syncTermsContentFromServer = async (force = false) => {
    if (!hasWindow()) {
        return readTermsContent();
    }

    const now = Date.now();
    if (!force && syncPromise && lastSyncedAt + SYNC_INTERVAL_MS > now) {
        return syncPromise;
    }

    syncPromise = (async () => {
        try {
            const serverContent = await fetchSiteContent("terms");
            writeTermsContent(serverContent);
            return readTermsContent();
        } catch {
            return readTermsContent();
        } finally {
            lastSyncedAt = Date.now();
        }
    })();

    return syncPromise;
};

export const updateTermsContent = async (content, token) => {
    try {
        const normalizedContent = normalizeTermsContent(content);
        await updateSiteContent("terms", normalizedContent, token);
        writeTermsContent(normalizedContent);
        return normalizedContent;
    } catch (error) {
        throw error;
    }
};

export const termsContentDefaults = defaultTermsContent;
