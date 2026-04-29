import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContactSettings, syncContactSettingsFromServer } from "../services/contactStore";

function Contact({ isDark }) {
    const navigate = useNavigate();
    const [contactSettings, setContactSettings] = useState(() => getContactSettings());

    useEffect(() => {
        const syncContact = () => setContactSettings(getContactSettings());
        const loadContact = async () => {
            await syncContactSettingsFromServer(true);
            syncContact();
        };

        syncContact();
        void loadContact();
        window.addEventListener("kc-contact-changed", syncContact);

        return () => window.removeEventListener("kc-contact-changed", syncContact);
    }, []);

    const {
        pageTitle,
        pageDescription,
        supportLine,
        email,
        phone,
        whatsapp,
        workingHours,
        address,
        responseNote,
    } = contactSettings;

    return (
        <main className={isDark ? "min-h-screen bg-black px-4 pb-12 pt-24 text-zinc-100 sm:px-6 lg:px-8" : "min-h-screen bg-zinc-50 px-4 pb-12 pt-24 text-zinc-900 sm:px-6 lg:px-8"}>
            <section className="mx-auto max-w-4xl">
                <div className="mb-10 animate-fade-up">
                    <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600"}>
                        {supportLine}
                    </p>
                    <h1 className="mt-3 text-4xl font-black sm:text-5xl">{pageTitle}</h1>
                    <p className={isDark ? "mt-3 max-w-2xl text-sm leading-7 text-zinc-300" : "mt-3 max-w-2xl text-sm leading-7 text-zinc-600"}>
                        {pageDescription}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                    <div className={isDark ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/20" : "rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/70"}>
                        <form className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className={isDark ? "mb-2 block text-sm font-semibold text-zinc-200" : "mb-2 block text-sm font-semibold text-zinc-700"}>Name</label>
                                    <input type="text" placeholder="Your name" className={isDark ? "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-cyan-500" : "w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"} />
                                </div>
                                <div>
                                    <label className={isDark ? "mb-2 block text-sm font-semibold text-zinc-200" : "mb-2 block text-sm font-semibold text-zinc-700"}>Email</label>
                                    <input type="email" placeholder="you@example.com" className={isDark ? "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-cyan-500" : "w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"} />
                                </div>
                            </div>

                            <div>
                                <label className={isDark ? "mb-2 block text-sm font-semibold text-zinc-200" : "mb-2 block text-sm font-semibold text-zinc-700"}>Subject</label>
                                <input type="text" placeholder="How can we help?" className={isDark ? "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-cyan-500" : "w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"} />
                            </div>

                            <div>
                                <label className={isDark ? "mb-2 block text-sm font-semibold text-zinc-200" : "mb-2 block text-sm font-semibold text-zinc-700"}>Message</label>
                                <textarea rows="6" placeholder="Write your message here..." className={isDark ? "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-cyan-500" : "w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"} />
                            </div>

                            <button type="button" className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">
                                Send Message
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className={isDark ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-6" : "rounded-3xl border border-zinc-200 bg-white p-6"}>
                            <h2 className="text-lg font-bold">Contact Details</h2>
                            <div className={isDark ? "mt-4 space-y-3 text-sm text-zinc-300" : "mt-4 space-y-3 text-sm text-zinc-600"}>
                                <p><span className="font-semibold text-cyan-500">Email:</span> {email}</p>
                                <p><span className="font-semibold text-cyan-500">Phone:</span> {phone}</p>
                                <p><span className="font-semibold text-cyan-500">WhatsApp:</span> {whatsapp}</p>
                                <p><span className="font-semibold text-cyan-500">Hours:</span> {workingHours}</p>
                                <p><span className="font-semibold text-cyan-500">Address:</span> {address}</p>
                            </div>
                        </div>

                        <div className={isDark ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-6" : "rounded-3xl border border-zinc-200 bg-white p-6"}>
                            <h2 className="text-lg font-bold">Need a faster answer?</h2>
                            <p className={isDark ? "mt-3 text-sm leading-7 text-zinc-300" : "mt-3 text-sm leading-7 text-zinc-600"}>
                                {responseNote}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <button onClick={() => navigate("/profile")} className="rounded-xl border border-cyan-500 px-4 py-2 text-sm font-semibold text-cyan-500 transition hover:bg-cyan-500 hover:text-white">
                                    My Account
                                </button>
                                <button onClick={() => navigate("/")} className={isDark ? "rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800" : "rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"}>
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Contact;
