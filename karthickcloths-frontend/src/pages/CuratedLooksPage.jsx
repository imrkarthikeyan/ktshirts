import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeContent, syncHomeContentFromServer } from "../services/homeStore";

function CuratedLooksPage({ isDark }) {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showContent, setShowContent] = useState(false);
    const [curatedLooks, setCuratedLooks] = useState(() => getHomeContent().curatedLooks.filter((look) => !look.hidden));
    const hasLooks = curatedLooks.length > 0;

    const goToPrev = () => {
        if (!hasLooks) {
            return;
        }
        setActiveIndex((prev) => (prev - 1 + curatedLooks.length) % curatedLooks.length);
    };

    const goToNext = () => {
        if (!hasLooks) {
            return;
        }
        setActiveIndex((prev) => (prev + 1) % curatedLooks.length);
    };

    const goToIndex = (index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const syncHomeContent = () => setCuratedLooks(getHomeContent().curatedLooks.filter((look) => !look.hidden));
        const loadFromServer = async () => {
            await syncHomeContentFromServer(true);
            syncHomeContent();
        };
        const syncHomeContentFromStorage = (event) => {
            if (!event.key || event.key === "kc-home-content-v1") {
                syncHomeContent();
            }
        };

        syncHomeContent();
        void loadFromServer();
        const intervalId = window.setInterval(() => {
            void loadFromServer();
        }, 15000);
        window.addEventListener("kc-home-content-changed", syncHomeContent);
        window.addEventListener("storage", syncHomeContentFromStorage);
        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("kc-home-content-changed", syncHomeContent);
            window.removeEventListener("storage", syncHomeContentFromStorage);
        };
    }, []);

    useEffect(() => {
        if (!curatedLooks.length || activeIndex >= curatedLooks.length) {
            setActiveIndex(0);
        }
    }, [activeIndex, curatedLooks.length]);

    return (
        <section className={isDark ? "bg-black px-4 py-16 transition-colors duration-500 md:py-20" : "bg-white px-4 py-16 transition-colors duration-500 md:py-20"}>
            <div className="mx-auto w-full max-w-[1400px]">
                {/* Title Section */}
                <div className={`mb-12 text-center transition-all duration-700 ease-out ${showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                    <h2 className={isDark ? "text-[32px] font-bold tracking-tight text-zinc-100 md:text-[48px]" : "text-[32px] font-bold tracking-tight text-zinc-900 md:text-[48px]"}>
                        Curated Looks
                    </h2>
                    <p className={isDark ? "mt-2 text-[18px] text-zinc-400 md:text-[20px]" : "mt-2 text-[18px] text-zinc-600 md:text-[20px]"}>
                        For You
                    </p>
                </div>

                {/* Carousel Container */}
                {!hasLooks ? (
                    <div className={isDark ? "rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 px-6 py-16 text-center text-zinc-300" : "rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center text-zinc-600"}>
                        Curated looks are not configured yet.
                    </div>
                ) : (
                    <div className="relative">
                        {/* Navigation Buttons */}
                        <button
                            onClick={goToPrev}
                            disabled={!hasLooks}
                            className={`absolute left-2 top-1/2 z-20 h-[45px] w-[45px] -translate-y-1/2 rounded-full border-2 transition-all hover:scale-110 active:scale-95 md:left-0 md:-translate-x-[58px] ${isDark ? "border-zinc-600 bg-zinc-900/80 text-zinc-300 hover:border-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" : "border-zinc-300 bg-white/80 text-zinc-900 hover:border-zinc-600 hover:bg-white"}`}
                            aria-label="Previous look"
                        >
                            <svg className="mx-auto h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={goToNext}
                            disabled={!hasLooks}
                            className={`absolute right-2 top-1/2 z-20 h-[45px] w-[45px] -translate-y-1/2 rounded-full border-2 transition-all hover:scale-110 active:scale-95 md:right-0 md:translate-x-[58px] ${isDark ? "border-zinc-600 bg-zinc-900/80 text-zinc-300 hover:border-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" : "border-zinc-300 bg-white/80 text-zinc-900 hover:border-zinc-600 hover:bg-white"}`}
                            aria-label="Next look"
                        >
                            <svg className="mx-auto h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Carousel Items */}
                        <div className={`relative overflow-hidden rounded-2xl transition-all duration-700 ease-out ${showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`} style={{ transitionDelay: "200ms" }}>
                            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-5">
                                {curatedLooks.map((look, index) => {
                                    const isActive = index === activeIndex;
                                    const position = (index - activeIndex + curatedLooks.length) % curatedLooks.length;
                                    const isVisible = position < 5;

                                    return (
                                        <div key={look.title} className="relative">
                                            {isVisible && (
                                                <article
                                                    className={`transform transition-all duration-700 ease-out ${isActive ? "scale-100 opacity-100" : "scale-95 opacity-60 hover:opacity-80"}`}
                                                    onClick={() => navigate(`/home-product/${look.product.id}/details`)}
                                                >
                                                    <div className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${isDark ? "border-zinc-700 shadow-lg shadow-black/40" : "border-zinc-200 shadow-lg shadow-zinc-300/40"}`}>
                                                        {/* Image Container */}
                                                        <div className="relative h-[320px] w-full overflow-hidden md:h-[380px]">
                                                            <img
                                                                src={look.image}
                                                                alt={look.title}
                                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                            {/* Gradient Overlay */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                        </div>

                                                        {/* Card Content */}
                                                        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isDark ? "bg-gradient-to-t from-black to-transparent" : "bg-gradient-to-t from-white/95 to-transparent"}`}>
                                                            <h3 className={isDark ? "text-[20px] font-bold text-white md:text-[24px]" : "text-[20px] font-bold text-zinc-900 md:text-[24px]"}>
                                                                {look.title}
                                                            </h3>
                                                            <p className={isDark ? "text-[14px] text-zinc-300 md:text-[16px]" : "text-[14px] text-zinc-600 md:text-[16px]"}>
                                                                {look.subtitle}
                                                            </p>
                                                        </div>

                                                        {/* Shop Button */}
                                                        <button
                                                            className={`absolute right-3 bottom-3 flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-semibold transition-all duration-300 active:scale-95 md:text-[14px] ${isDark ? "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/20" : "border border-zinc-900/30 bg-white/80 text-zinc-900 backdrop-blur-sm hover:border-zinc-900/60 hover:bg-white"}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate("/constitutional-edition");
                                                            }}
                                                        >
                                                            <span>Shop All</span>
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                            </svg>
                                                        </button>

                                                        {/* Active Indicator */}
                                                        {isActive && (
                                                            <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${isDark ? "border-zinc-400" : "border-zinc-600"}`} />
                                                        )}
                                                    </div>
                                                </article>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dot Indicators */}
                        <div className={`mt-8 flex items-center justify-center gap-2 transition-all duration-700 ease-out ${showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`} style={{ transitionDelay: "400ms" }}>
                            {curatedLooks.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToIndex(index)}
                                    aria-label={`Go to look ${index + 1}`}
                                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? (isDark ? "w-8 bg-zinc-300" : "w-8 bg-zinc-700") : isDark ? "bg-zinc-600 hover:bg-zinc-500" : "bg-zinc-400 hover:bg-zinc-500"}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default CuratedLooksPage;
