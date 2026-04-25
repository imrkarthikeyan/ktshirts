import { Link } from "react-router-dom";

function StoreLocator({ isDark }) {
    return (
        <main className={isDark ? "min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100" : "min-h-screen bg-zinc-50 px-4 py-12 text-zinc-900"}>
            <section className="mx-auto max-w-6xl">
                <div className={isDark ? "rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl shadow-black/20" : "rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-200/70"}>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-500">Store Locator</p>
                    <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Mettur, Tamil Nadu</h1>
                    <p className={isDark ? "mt-3 max-w-3xl text-sm leading-7 text-zinc-300" : "mt-3 max-w-3xl text-sm leading-7 text-zinc-600"}>
                        Visit our location in Mettur for in-person assistance on custom orders, fabric selection, and sizing.
                    </p>

                    <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                        <div className={isDark ? "overflow-hidden rounded-2xl border border-zinc-800" : "overflow-hidden rounded-2xl border border-zinc-200"}>
                            <iframe
                                title="Mettur Tamil Nadu map"
                                src="https://www.google.com/maps?q=Mettur%2C%20Tamil%20Nadu&output=embed"
                                className="h-[420px] w-full"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        <aside className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-5" : "rounded-2xl border border-zinc-200 bg-zinc-50 p-5"}>
                            <h2 className="text-xl font-bold">Store Details</h2>
                            <div className="mt-4 space-y-3 text-sm">
                                <p><span className="font-semibold">City:</span> Mettur</p>
                                <p><span className="font-semibold">State:</span> Tamil Nadu</p>
                                <p><span className="font-semibold">Support:</span> Custom T-shirt orders and tracking help</p>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link to="/contact" className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600">
                                    Contact Store
                                </Link>
                                <Link to="/custom-edition/track" className={isDark ? "rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-100" : "rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800"}>
                                    Track Order
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default StoreLocator;
