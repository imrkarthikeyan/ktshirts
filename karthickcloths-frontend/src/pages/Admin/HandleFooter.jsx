import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { footerSettingsDefaults, getFooterSettings, resetFooterSettings, syncFooterSettingsFromServer, updateFooterSettings } from "../../services/footerStore";

const createLocationRow = (location = {}) => ({
    label: location.label || "",
    address: location.address || "",
});

function HandleFooter({ isDark }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState(() => getFooterSettings());
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!(user?.admin || user?.isAdmin)) {
            navigate("/", { replace: true });
        }
    }, [navigate, user?.admin, user?.isAdmin]);

    useEffect(() => {
        const loadFooter = async () => {
            await syncFooterSettingsFromServer(true);
            setFormData(getFooterSettings());
        };

        void loadFooter();
    }, []);

    const handleTextChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleContactChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            contactDetails: {
                ...previous.contactDetails,
                [name]: value,
            },
        }));
    };

    const handleLocationChange = (index, field, value) => {
        setFormData((previous) => {
            const nextLocations = [...previous.locations];
            nextLocations[index] = {
                ...nextLocations[index],
                [field]: value,
            };

            return {
                ...previous,
                locations: nextLocations,
            };
        });
    };

    const addLocation = () => {
        setFormData((previous) => ({
            ...previous,
            locations: [...previous.locations, createLocationRow()],
        }));
    };

    const removeLocation = (index) => {
        setFormData((previous) => ({
            ...previous,
            locations: previous.locations.filter((_, currentIndex) => currentIndex !== index),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const cleanedLocations = formData.locations
            .map((location) => ({
                label: String(location.label || "").trim(),
                address: String(location.address || "").trim(),
            }))
            .filter((location) => location.label || location.address);

        try {
            await updateFooterSettings({
                brandName: formData.brandName,
                tagline: formData.tagline,
                gstin: formData.gstin,
                copyrightText: formData.copyrightText,
                contactDetails: {
                    phone: formData.contactDetails.phone,
                    whatsapp: formData.contactDetails.whatsapp,
                    email: formData.contactDetails.email,
                    workingHours: formData.contactDetails.workingHours,
                },
                locations: cleanedLocations,
            });

            const successMessage = "Footer content saved for all users.";
            setMessage(successMessage);
            window.alert(successMessage);
        } catch (error) {
            const errorMessage = error.message || "Unable to save footer content for all users.";
            setMessage(errorMessage);
            window.alert(errorMessage);
        }
    };

    const handleReset = async () => {
        try {
            const nextSettings = await resetFooterSettings();
            setFormData(nextSettings);
            setMessage("Footer content reset for all users.");
        } catch (error) {
            setMessage(error.message || "Unable to reset footer content for all users.");
        }
    };

    const pageClass = isDark ? "min-h-screen bg-zinc-950 px-4 pb-12 pt-28 text-zinc-100" : "min-h-screen bg-zinc-50 px-4 pb-12 pt-28 text-zinc-900";
    const cardClass = isDark ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20" : "rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60";
    const inputClass = isDark
        ? "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none placeholder:text-zinc-500"
        : "w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none placeholder:text-zinc-400";

    return (
        <main className={pageClass}>
            <section className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600"}>
                            Admin workspace
                        </p>
                        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Handle Footer</h1>
                        <p className={isDark ? "mt-3 max-w-2xl text-sm leading-7 text-zinc-300" : "mt-3 max-w-2xl text-sm leading-7 text-zinc-600"}>
                            Edit the footer tagline, GSTIN, locations, and contact details that appear across the storefront.
                        </p>
                    </div>
                    <div className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300" : "rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"}>
                        Signed in as <span className="font-semibold">{user?.fullName}</span>
                    </div>
                </div>

                {message ? (
                    <div className={isDark ? "mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200" : "mb-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"}>
                        {message}
                    </div>
                ) : null}

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className={cardClass}>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Footer form</p>
                                <h2 className="mt-2 text-2xl font-semibold">Update footer content</h2>
                            </div>
                            <button type="button" onClick={() => navigate("/admin")} className={isDark ? "rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700"}>
                                Back to Admin
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Brand Name</span>
                                <input name="brandName" value={formData.brandName} onChange={handleTextChange} className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Tagline</span>
                                <textarea name="tagline" value={formData.tagline} onChange={handleTextChange} rows="4" className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">GSTIN</span>
                                <input name="gstin" value={formData.gstin} onChange={handleTextChange} className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Copyright Text</span>
                                <input name="copyrightText" value={formData.copyrightText} onChange={handleTextChange} className={inputClass} />
                            </label>

                            <div className="md:col-span-2 rounded-2xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold">Contact Details</p>
                                        <p className={isDark ? "text-xs text-zinc-400" : "text-xs text-zinc-500"}>These values appear in the footer contact card.</p>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                    <label className="space-y-2 text-sm">
                                        <span className="font-medium">Phone</span>
                                        <input name="phone" value={formData.contactDetails.phone} onChange={handleContactChange} className={inputClass} />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="font-medium">WhatsApp</span>
                                        <input name="whatsapp" value={formData.contactDetails.whatsapp} onChange={handleContactChange} className={inputClass} />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="font-medium">Email</span>
                                        <input name="email" type="email" value={formData.contactDetails.email} onChange={handleContactChange} className={inputClass} />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="font-medium">Working Hours</span>
                                        <input name="workingHours" value={formData.contactDetails.workingHours} onChange={handleContactChange} className={inputClass} />
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-2 rounded-2xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold">Locations</p>
                                        <p className={isDark ? "text-xs text-zinc-400" : "text-xs text-zinc-500"}>Add one or more store or warehouse locations.</p>
                                    </div>
                                    <button type="button" onClick={addLocation} className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-white">
                                        Add Location
                                    </button>
                                </div>

                                <div className="mt-4 space-y-4">
                                    {formData.locations.map((location, index) => (
                                        <div key={`${index}-${location.label || "location"}`} className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4" : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4"}>
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold">Location {index + 1}</p>
                                                {formData.locations.length > 1 ? (
                                                    <button type="button" onClick={() => removeLocation(index)} className="text-xs font-semibold text-red-500">
                                                        Remove
                                                    </button>
                                                ) : null}
                                            </div>
                                            <div className="mt-3 grid gap-4 md:grid-cols-2">
                                                <label className="space-y-2 text-sm">
                                                    <span className="font-medium">Label</span>
                                                    <input value={location.label} onChange={(event) => handleLocationChange(index, "label", event.target.value)} className={inputClass} />
                                                </label>
                                                <label className="space-y-2 text-sm md:col-span-2">
                                                    <span className="font-medium">Address</span>
                                                    <textarea value={location.address} onChange={(event) => handleLocationChange(index, "address", event.target.value)} rows="3" className={inputClass} />
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                                <button type="submit" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
                                    Save Footer
                                </button>
                                <button type="button" onClick={handleReset} className={isDark ? "rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700"}>
                                    Reset Footer
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className={cardClass}>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Live preview</p>
                            <h2 className="mt-2 text-2xl font-semibold">Footer Snapshot</h2>
                        </div>

                        <div className={isDark ? "mt-5 space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5" : "mt-5 space-y-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-5"}>
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-[0.28em] opacity-70">{formData.brandName || footerSettingsDefaults.brandName}</p>
                                <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-300">{formData.tagline || footerSettingsDefaults.tagline}</p>
                                <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">GSTIN: {formData.gstin || footerSettingsDefaults.gstin}</p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm font-bold uppercase tracking-[0.2em]">Location</p>
                                {formData.locations.length > 0 ? (
                                    formData.locations.map((location, index) => (
                                        <div key={`${location.label}-${index}`}>
                                            <p className="font-semibold">{location.label || "Location"}</p>
                                            <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-300">{location.address || "Address goes here"}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-zinc-500 dark:text-zinc-300">No locations configured.</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.2em]">Contact Details</p>
                                <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-500 dark:text-zinc-300">
                                    <li><span className="font-semibold">Phone:</span> {formData.contactDetails.phone}</li>
                                    <li><span className="font-semibold">WhatsApp:</span> {formData.contactDetails.whatsapp}</li>
                                    <li><span className="font-semibold">Email:</span> {formData.contactDetails.email}</li>
                                    <li><span className="font-semibold">Working Hours:</span> {formData.contactDetails.workingHours}</li>
                                </ul>
                            </div>
                            <p className="border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">{formData.copyrightText || footerSettingsDefaults.copyrightText}</p>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

export default HandleFooter;