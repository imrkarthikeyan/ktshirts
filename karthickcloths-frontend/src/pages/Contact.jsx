import { useNavigate } from "react-router-dom";

function Contact({ isDark }) {
    const navigate = useNavigate();

    return (
        <main className={isDark ? "min-h-screen bg-black px-4 pb-12 pt-24 text-zinc-100 sm:px-6 lg:px-8" : "min-h-screen bg-zinc-50 px-4 pb-12 pt-24 text-zinc-900 sm:px-6 lg:px-8"}>
            <section className="mx-auto max-w-4xl">
                <div className="mb-10 animate-fade-up">
                    <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600"}>
                        We are here to help
                    </p>
                    <h1 className="mt-3 text-4xl font-black sm:text-5xl">Contact Us</h1>
                    <p className={isDark ? "mt-3 max-w-2xl text-sm leading-7 text-zinc-300" : "mt-3 max-w-2xl text-sm leading-7 text-zinc-600"}>
                        Reach out for order help, product questions, sizing support, or partnership inquiries. Our team usually responds within one business day.
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
                                <p><span className="font-semibold text-cyan-500">Email:</span> support@karthickcloths.com</p>
                                <p><span className="font-semibold text-cyan-500">Phone:</span> +91 98765 43210</p>
                                <p><span className="font-semibold text-cyan-500">Hours:</span> Mon - Sat, 9:00 AM - 7:00 PM</p>
                                <p><span className="font-semibold text-cyan-500">Address:</span> Chennai, Tamil Nadu, India</p>
                            </div>
                        </div>

                        <div className={isDark ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-6" : "rounded-3xl border border-zinc-200 bg-white p-6"}>
                            <h2 className="text-lg font-bold">Need a faster answer?</h2>
                            <p className={isDark ? "mt-3 text-sm leading-7 text-zinc-300" : "mt-3 text-sm leading-7 text-zinc-600"}>
                                Use the profile page for order tracking and cart details, or go back to shopping for more products.
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
