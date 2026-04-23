function WomenPage({ isDark }) {
    return (
        <main className={isDark ? "min-h-screen bg-black text-zinc-100" : "min-h-screen bg-white text-zinc-900"}>
            <section className={isDark ? "border-b border-zinc-800 bg-[radial-gradient(circle_at_top,_#1f1f1f,_#000)]" : "border-b border-zinc-200 bg-[radial-gradient(circle_at_top,_#ffffff,_#f5f5f5)]"}>
                <div className="mx-auto max-w-7xl px-4 py-20 text-center">
                    <p className={isDark ? "fade-up text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400" : "fade-up text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600"}>
                        Women Wear
                    </p>
                    <h1 className="fade-up mt-4 text-4xl font-bold md:text-6xl">Elegant Black & White Edit</h1>
                    <p className={isDark ? "fade-up mx-auto mt-4 max-w-2xl text-sm text-zinc-400 md:text-base" : "fade-up mx-auto mt-4 max-w-2xl text-sm text-zinc-600 md:text-base"}>
                        Women collection is now available at a dedicated route. Product cards and details can be expanded next.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12">
                <div className={isDark ? "slide-in-right rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center" : "slide-in-right rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center"}>
                    <p className={isDark ? "text-zinc-300" : "text-zinc-700"}>
                        Route ready: /women
                    </p>
                </div>
            </section>
        </main>
    );
}

export default WomenPage;
