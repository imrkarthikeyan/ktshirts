import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CuratedLooksPage from "./CuratedLooksPage";
import { getHomeContent, syncHomeContentFromServer } from "../services/homeStore";

function HomePage({ isDark }) {
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(0);
    const [showContent, setShowContent] = useState(false);
    const [isRailPaused, setIsRailPaused] = useState(false);
    const [homeContent, setHomeContent] = useState(() => getHomeContent());
    const railRef = useRef(null);

    const heroSlides = homeContent.heroSlides || [];
    const categoryItems = homeContent.categoryItems || [];
    const featuredCards = homeContent.featuredCards || [];
    const movingItems = useMemo(() => [...categoryItems, ...categoryItems], [categoryItems]);
    const currentSlide = heroSlides[activeSlide] || heroSlides[0];

    const goToNextSlide = () => {
        if (heroSlides.length === 0) {
            return;
        }

        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const goToPrevSlide = () => {
        if (heroSlides.length === 0) {
            return;
        }

        setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    const goToSlide = (index) => {
        setActiveSlide(index);
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setShowContent(true);
        }, 120);

        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        const syncHomeContent = () => setHomeContent(getHomeContent());
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
        if (heroSlides.length === 0) {
            setActiveSlide(0);
            return undefined;
        }

        setActiveSlide((prev) => Math.min(prev, heroSlides.length - 1));

        const autoSlide = window.setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % heroSlides.length);
        }, 3000);

        return () => window.clearInterval(autoSlide);
    }, [heroSlides.length]);

    useEffect(() => {
        const node = railRef.current;
        if (!node) {
            return;
        }

        node.scrollLeft = node.scrollWidth / 2;

        const interval = window.setInterval(() => {
            const currentNode = railRef.current;
            if (!currentNode || isRailPaused) {
                return;
            }

            currentNode.scrollLeft -= 0.6;
            if (currentNode.scrollLeft <= 0) {
                currentNode.scrollLeft = currentNode.scrollWidth / 2;
            }
        }, 16);

        return () => window.clearInterval(interval);
    }, [isRailPaused]);

    return (
        <main className={isDark ? "bg-black px-0 pb-[40px] pt-[8px] transition-colors duration-500 lg:pt-[14px]" : "bg-white px-0 pb-[40px] pt-[8px] transition-colors duration-500 lg:pt-[14px]"}>
            <section className="relative mx-auto min-h-[470px] w-full max-w-[1420px] overflow-hidden rounded-none border-y border-zinc-300 bg-zinc-900 shadow-[0_20px_60px_rgba(0,0,0,0.2)] md:w-[96%] md:rounded-2xl md:border dark:border-zinc-700">
                {heroSlides.map((slide, index) => (
                    <div
                        key={slide.id || slide.image || index}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(slide.targetPath || "/constitutional-edition")}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                navigate(slide.targetPath || "/constitutional-edition");
                            }
                        }}
                        className={`absolute inset-0 h-[470px] w-full transition-all duration-700 md:h-[620px] ${index === activeSlide ? "scale-100 opacity-100" : "pointer-events-none scale-[1.02] opacity-0"}`}
                    >
                        <img className="h-full w-full object-cover" src={slide.image} alt={`${slide.title} ${slide.subtitle}`} />
                    </div>
                ))}

                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

                <button
                    onClick={goToPrevSlide}
                    className="absolute left-[10px] top-1/2 z-10 h-[34px] w-[34px] -translate-y-1/2 cursor-pointer rounded-full border border-zinc-300 bg-white/85 text-[24px] text-zinc-900 transition hover:scale-110 hover:bg-white md:left-[14px] md:h-[38px] md:w-[38px] md:text-[28px]"
                    aria-label="Previous slide"
                >
                    ‹
                </button>

                {currentSlide ? (
                    <div className="absolute right-[5%] top-[16%] z-10 text-left text-white md:right-[10%] md:top-[18%]">
                        <h2 className="m-0 text-[20px] font-medium leading-tight tracking-tight text-zinc-200 sm:text-[26px] md:text-[70px]">
                            {currentSlide.title}
                        </h2>
                        <h1 className="mb-2 mt-1 text-[34px] font-semibold leading-[1] sm:text-[46px] md:text-[52px]">
                            {currentSlide.subtitle}
                        </h1>
                        <p className="mb-5 text-[20px] text-zinc-300 sm:text-[26px] md:text-[48px]">{currentSlide.offer}</p>
                        <button
                            type="button"
                            onClick={() => navigate(currentSlide.targetPath || "/constitutional-edition")}
                            className="inline-block border-b-2 border-white text-base font-bold tracking-[1.4px] transition hover:-translate-y-0.5 hover:text-zinc-200 sm:text-lg md:text-[32px]"
                        >
                            {currentSlide.cta}
                        </button>
                    </div>
                ) : null}

                <button
                    onClick={goToNextSlide}
                    className="absolute right-[10px] top-1/2 z-10 h-[34px] w-[34px] -translate-y-1/2 cursor-pointer rounded-full border border-zinc-300 bg-white/85 text-[24px] text-zinc-900 transition hover:scale-110 hover:bg-white md:right-[14px] md:h-[38px] md:w-[38px] md:text-[28px]"
                    aria-label="Next slide"
                >
                    ›
                </button>
            </section>

            <div className={isDark ? "mx-auto flex w-full max-w-[1320px] items-center justify-center gap-2 py-6 text-white md:w-[96%]" : "mx-auto flex w-full max-w-[1320px] items-center justify-center gap-2 py-6 text-zinc-900 md:w-[96%]"}>
                {heroSlides.map((slide, index) => (
                    <button
                        key={slide.id || slide.title || index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={index === activeSlide ? "h-2.5 w-2.5 rounded-full bg-zinc-900 transition dark:bg-zinc-100" : "h-2.5 w-2.5 rounded-full bg-zinc-400 transition dark:bg-zinc-700"}
                    />
                ))}
            </div>

            <section className="mx-auto mt-8 w-full max-w-[1420px] overflow-hidden md:w-[96%]">
                <div
                    ref={railRef}
                    onMouseEnter={() => setIsRailPaused(true)}
                    onMouseLeave={() => setIsRailPaused(false)}
                    className="flex items-start gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {movingItems.map((item, index) => (
                        <button
                            key={`${item.id || item.title || index}-${index}`}
                            type="button"
                            onClick={() => navigate(item.targetPath || "/constitutional-edition")}
                            className={`min-w-[176px] flex-none text-left transition-all duration-700 ease-out md:min-w-[188px] ${showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                            style={{ transitionDelay: `${Math.min(index, categoryItems.length - 1) * 90}ms` }}
                        >
                            <div className={isDark ? "h-[172px] overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:h-[176px]" : "h-[172px] overflow-hidden rounded-md border border-zinc-300 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:h-[176px]"}>
                                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                            </div>
                            <h3 className={isDark ? "pt-2 text-center text-[20px] font-medium tracking-[0.8px] text-zinc-100 md:text-[24px]" : "pt-2 text-center text-[20px] font-medium tracking-[0.8px] text-zinc-900 md:text-[24px]"}>
                                {item.title}
                            </h3>
                        </button>
                    ))}
                </div>

                <div className="mx-auto mt-10 grid max-w-[760px] grid-cols-1 gap-8 pb-8 md:max-w-[950px] md:grid-cols-2">
                    {featuredCards.map((card, index) => (
                        <article
                            key={card.title}
                            className={`cursor-pointer overflow-hidden rounded-xl transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,0.16)] ${isDark ? "border border-zinc-700 bg-zinc-900 shadow-[0_6px_30px_rgba(0,0,0,0.1)]" : "border border-zinc-300 bg-white shadow-[0_6px_30px_rgba(0,0,0,0.1)]"} ${showContent ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                            onClick={() => navigate(`/home-product/${card.product.id}/details`)}
                            style={{ transitionDelay: `${420 + index * 140}ms` }}
                        >
                            <div className="h-[320px] overflow-hidden md:h-[320px]">
                                <img src={card.image} alt={card.title} className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]" />
                            </div>
                            <div className="px-5 pb-5 pt-4">
                                <h3 className={isDark ? "text-[34px] font-semibold leading-tight text-zinc-100 md:text-[40px]" : "text-[34px] font-semibold leading-tight text-zinc-900 md:text-[40px]"}>
                                    {card.title}
                                </h3>
                                <p className={isDark ? "mt-1 text-[20px] text-zinc-300 md:text-[24px]" : "mt-1 text-[20px] text-zinc-700 md:text-[24px]"}>{card.subtitle}</p>
                                <a
                                    href={`/home-product/${card.product.id}/details`}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        navigate(`/home-product/${card.product.id}/details`);
                                    }}
                                    className={isDark ? "mt-2 inline-block border-b-2 border-zinc-100 text-[26px] font-semibold tracking-wide transition hover:text-zinc-300 md:text-[30px]" : "mt-2 inline-block border-b-2 border-zinc-900 text-[26px] font-semibold tracking-wide transition hover:text-zinc-600 md:text-[30px]"}
                                >
                                    SHOP NOW
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <CuratedLooksPage isDark={isDark} />
        </main>
    );
}

export default HomePage;
