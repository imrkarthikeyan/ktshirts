import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { contactSettingsDefaults, getContactSettings, resetContactSettings, syncContactSettingsFromServer, updateContactSettings } from "../../services/contactStore";

function HandleContact({ isDark }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState(() => getContactSettings());
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!(user?.admin || user?.isAdmin)) {
            navigate("/", { replace: true });
        }
    }, [navigate, user?.admin, user?.isAdmin]);

    useEffect(() => {
        const loadContact = async () => {
            await syncContactSettingsFromServer(true);
            setFormData(getContactSettings());
        };

        void loadContact();
        const syncContact = () => setFormData(getContactSettings());
        window.addEventListener("kc-contact-changed", syncContact);
        return () => window.removeEventListener("kc-contact-changed", syncContact);
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await updateContactSettings(formData);
            const successMessage = "Contact details saved for all users.";
            setMessage(successMessage);
            window.alert(successMessage);
        } catch (error) {
            const errorMessage = error.message || "Unable to save contact details for all users.";
            setMessage(errorMessage);
            window.alert(errorMessage);
        }
    };

    const handleReset = async () => {
        try {
            const nextSettings = await resetContactSettings();
            setFormData(nextSettings);
            setMessage("Contact details reset for all users.");
        } catch (error) {
            setMessage(error.message || "Unable to reset contact details for all users.");
        }
    };

    const pageClass = isDark ? "min-h-screen bg-zinc-950 px-4 pb-12 pt-28 text-zinc-100" : "min-h-screen bg-zinc-50 px-4 pb-12 pt-28 text-zinc-900";
    const cardClass = isDark ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20" : "rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60";
    const inputClass = isDark ? "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none placeholder:text-zinc-500" : "w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none placeholder:text-zinc-400";

    return (
        <main className={pageClass}>
            <section className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600"}>
                            Admin workspace
                        </p>
                        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Handle Contact</h1>
                        <p className={isDark ? "mt-3 max-w-2xl text-sm leading-7 text-zinc-300" : "mt-3 max-w-2xl text-sm leading-7 text-zinc-600"}>
                            Edit the public contact page content, support details, and response note shown to customers.
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
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Contact form</p>
                                <h2 className="mt-2 text-2xl font-semibold">Update contact page</h2>
                            </div>
                            <button type="button" onClick={() => navigate("/admin")} className={isDark ? "rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700"}>
                                Back to Admin
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Support Line</span>
                                <input name="supportLine" value={formData.supportLine} onChange={handleChange} className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Page Title</span>
                                <input name="pageTitle" value={formData.pageTitle} onChange={handleChange} className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Page Description</span>
                                <textarea name="pageDescription" value={formData.pageDescription} onChange={handleChange} rows="4" className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Email</span>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Phone</span>
                                <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">WhatsApp</span>
                                <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Working Hours</span>
                                <input name="workingHours" value={formData.workingHours} onChange={handleChange} className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Address</span>
                                <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className={inputClass} />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Response Note</span>
                                <textarea name="responseNote" value={formData.responseNote} onChange={handleChange} rows="3" className={inputClass} />
                            </label>

                            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                                <button type="submit" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
                                    Save Contact Details
                                </button>
                                <button type="button" onClick={handleReset} className={isDark ? "rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700"}>
                                    Reset Contact Details
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className={cardClass}>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Live preview</p>
                            <h2 className="mt-2 text-2xl font-semibold">Contact page snapshot</h2>
                        </div>

                        <div className={isDark ? "mt-5 space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5" : "mt-5 space-y-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-5"}>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-500">{formData.supportLine || contactSettingsDefaults.supportLine}</p>
                            <h3 className="text-2xl font-black">{formData.pageTitle || contactSettingsDefaults.pageTitle}</h3>
                            <p className={isDark ? "text-sm leading-7 text-zinc-300" : "text-sm leading-7 text-zinc-600"}>{formData.pageDescription || contactSettingsDefaults.pageDescription}</p>
                            <div className={isDark ? "space-y-3 text-sm text-zinc-300" : "space-y-3 text-sm text-zinc-600"}>
                                <p><span className="font-semibold text-cyan-500">Email:</span> {formData.email}</p>
                                <p><span className="font-semibold text-cyan-500">Phone:</span> {formData.phone}</p>
                                <p><span className="font-semibold text-cyan-500">WhatsApp:</span> {formData.whatsapp}</p>
                                <p><span className="font-semibold text-cyan-500">Hours:</span> {formData.workingHours}</p>
                                <p><span className="font-semibold text-cyan-500">Address:</span> {formData.address}</p>
                            </div>
                            <p className={isDark ? "border-t border-zinc-800 pt-4 text-sm leading-7 text-zinc-400" : "border-t border-zinc-200 pt-4 text-sm leading-7 text-zinc-500"}>{formData.responseNote}</p>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

export default HandleContact;
