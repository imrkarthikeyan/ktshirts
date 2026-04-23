import { useEffect, useMemo, useRef, useState } from "react";
import CuratedLooksPage from "./CuratedLooksPage";

const heroSlides = [
    {
        title: "Denim",
        subtitle: "Dreams",
        offer: "Up To 50% Off",
        cta: "SHOP NOW",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1900&q=80",
    },
    {
        title: "Perfectly",
        subtitle: "Suited",
        offer: "Premium Workwear Edit",
        cta: "SHOP WORKWEAR",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1900&q=80",
    },
    {
        title: "Urban",
        subtitle: "Basics",
        offer: "Fresh Fits For Every Day",
        cta: "SHOP CASUAL",
        image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1900&q=80",
    },
    {
        title: "Summer",
        subtitle: "Cottons",
        offer: "Breezy Looks Starting Today",
        cta: "SHOP NOW",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1900&q=80",
    },
    {
        title: "Street",
        subtitle: "Culture",
        offer: "New Drop Just Landed",
        cta: "EXPLORE MORE",
        image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1900&q=80",
    },
    {
        title: "Bold",
        subtitle: "Essentials",
        offer: "Everyday Must Haves",
        cta: "SHOP DAILY",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1900&q=80",
    },
];

const categoryItems = [
    {
        title: "SS26",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80",
    },
    {
        title: "Women",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
    },
    {
        title: "Men",
        image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=700&q=80",
    },
    {
        title: "Kids",
        image: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=700&q=80",
    },
    {
        title: "WROGN",
        image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=700&q=80",
    },
    {
        title: "Footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    },
    {
        title: "Beauty",
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=700&q=80",
    },
];

const editCards = [
    {
        title: "On-Trend",
        subtitle: "Fresh styles for modern elegance for women",
        image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80",
    },
    {
        title: "Varsity Edit",
        subtitle: "Sport-inspired styles with street attitude",
        image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
    },
];

function HomePage({ isDark }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [showContent, setShowContent] = useState(false);
    const [isRailPaused, setIsRailPaused] = useState(false);
    const railRef = useRef(null);

    const movingItems = useMemo(() => [...categoryItems, ...categoryItems], []);

    const goToNextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const goToPrevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    const goToSlide = (index) => {
        setActiveSlide(index);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 120);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const autoSlide = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % heroSlides.length);
        }, 3000);

        return () => clearInterval(autoSlide);
    }, []);

    useEffect(() => {
        const node = railRef.current;
        if (!node) {
            return;
        }

        node.scrollLeft = node.scrollWidth / 2;

        const interval = setInterval(() => {
            const currentNode = railRef.current;
            if (!currentNode || isRailPaused) {
                return;
            }

            currentNode.scrollLeft -= 0.6;
            if (currentNode.scrollLeft <= 0) {
                currentNode.scrollLeft = currentNode.scrollWidth / 2;
            }
        }, 16);

        return () => clearInterval(interval);
    }, [isRailPaused]);

    return (
        <main className={isDark ? "bg-black px-0 pb-[40px] pt-[8px] transition-colors duration-500 lg:pt-[14px]" : "bg-white px-0 pb-[40px] pt-[8px] transition-colors duration-500 lg:pt-[14px]"}>
            <section className="relative mx-auto min-h-[470px] w-full max-w-[1420px] overflow-hidden rounded-none border-y border-zinc-300 bg-zinc-900 shadow-[0_20px_60px_rgba(0,0,0,0.2)] md:w-[96%] md:rounded-2xl md:border dark:border-zinc-700">
                {heroSlides.map((slide, index) => (
                    <img
                        key={slide.image}
                        className={`absolute inset-0 h-[470px] w-full object-cover transition-all duration-700 ${index === activeSlide ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"
                            } md:h-[620px]`}
                        src={slide.image}
                        alt={`${slide.title} ${slide.subtitle}`}
                    />
                ))}

                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

                <button
                    onClick={goToPrevSlide}
                    className="absolute left-[10px] top-1/2 z-10 h-[34px] w-[34px] -translate-y-1/2 cursor-pointer rounded-full border border-zinc-300 bg-white/85 text-[24px] text-zinc-900 transition hover:scale-110 hover:bg-white md:left-[14px] md:h-[38px] md:w-[38px] md:text-[28px]"
                    aria-label="Previous slide"
                >
                    ‹
                </button>

                <div className="absolute right-[5%] top-[16%] z-10 text-left text-white md:right-[10%] md:top-[18%]">
                    <h2 className="m-0 text-[20px] font-medium leading-tight tracking-tight text-zinc-200 sm:text-[26px] md:text-[70px]">
                        {heroSlides[activeSlide].title}
                    </h2>
                    <h1 className="mb-2 mt-1 text-[34px] font-semibold leading-[1] sm:text-[46px] md:text-[52px]">
                        {heroSlides[activeSlide].subtitle}
                    </h1>
                    <p className="mb-5 text-[20px] text-zinc-300 sm:text-[26px] md:text-[48px]">{heroSlides[activeSlide].offer}</p>
                    <a
                        href="#"
                        className="inline-block border-b-2 border-white text-base font-bold tracking-[1.4px] transition hover:-translate-y-0.5 hover:text-zinc-200 sm:text-lg md:text-[32px]"
                    >
                        {heroSlides[activeSlide].cta}
                    </a>
                </div>

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
                        key={slide.title}
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
                        <article
                            key={`${item.title}-${index}`}
                            className={`min-w-[176px] flex-none transition-all duration-700 ease-out md:min-w-[188px] ${showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                }`}
                            style={{ transitionDelay: `${Math.min(index, categoryItems.length - 1) * 90}ms` }}
                        >
                            <div className={isDark ? "h-[172px] overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:h-[176px]" : "h-[172px] overflow-hidden rounded-md border border-zinc-300 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:h-[176px]"}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                                />
                            </div>
                            <h3 className={isDark ? "pt-2 text-center text-[20px] font-medium tracking-[0.8px] text-zinc-100 md:text-[24px]" : "pt-2 text-center text-[20px] font-medium tracking-[0.8px] text-zinc-900 md:text-[24px]"}>
                                {item.title}
                            </h3>
                        </article>
                    ))}
                </div>

                <div className="mx-auto mt-10 grid max-w-[760px] grid-cols-1 gap-8 pb-8 md:max-w-[950px] md:grid-cols-2">
                    {editCards.map((card, index) => (
                        <article
                            key={card.title}
                            className={`overflow-hidden rounded-xl transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,0.16)] ${isDark ? "border border-zinc-700 bg-zinc-900 shadow-[0_6px_30px_rgba(0,0,0,0.1)]" : "border border-zinc-300 bg-white shadow-[0_6px_30px_rgba(0,0,0,0.1)]"} ${showContent ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                                }`}
                            style={{ transitionDelay: `${420 + index * 140}ms` }}
                        >
                            <div className="h-[320px] overflow-hidden md:h-[320px]">
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
                                />
                            </div>
                            <div className="px-5 pb-5 pt-4">
                                <h3 className={isDark ? "text-[34px] font-semibold leading-tight text-zinc-100 md:text-[40px]" : "text-[34px] font-semibold leading-tight text-zinc-900 md:text-[40px]"}>
                                    {card.title}
                                </h3>
                                <p className={isDark ? "mt-1 text-[20px] text-zinc-300 md:text-[24px]" : "mt-1 text-[20px] text-zinc-700 md:text-[24px]"}>{card.subtitle}</p>
                                <a
                                    href="#"
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
