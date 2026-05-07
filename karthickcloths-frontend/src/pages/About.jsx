import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAboutContent, syncAboutContentFromServer } from "../services/aboutStore";

function About({ isDark }) {
    const navigate = useNavigate();
    const [content, setContent] = useState(getAboutContent());
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const loadContent = async () => {
            await syncAboutContentFromServer(true);
            setContent(getAboutContent());
        };
        loadContent();

        const handleContentChange = () => {
            setContent(getAboutContent());
        };

        window.addEventListener("kc-about-changed", handleContentChange);
        return () => window.removeEventListener("kc-about-changed", handleContentChange);
    }, []);

    return (
        <div className={isDark ? "min-h-screen bg-black text-white" : "min-h-screen bg-white text-black"}>
            {/* Hero Section */}
            <div className="relative h-96 overflow-hidden">
                <img
                    src={content.heroImage}
                    alt="About Hero"
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${isVisible ? "scale-100" : "scale-110"}`}
                />
                <div className={`absolute inset-0 ${isDark ? "bg-black/60" : "bg-white/40"}`}></div>
                <div className="relative h-full flex items-center justify-center">
                    <div className="text-center">
                        <h1 className={`text-5xl md:text-7xl font-bold mb-4 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            {content.title}
                        </h1>
                        <p className={`text-xl md:text-2xl transition-all duration-1000 delay-200 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            Crafted with passion, delivered with excellence
                        </p>
                    </div>
                </div>
            </div>

            {/* Story Section */}
            <section className={`py-20 px-4 md:px-20 ${isDark ? "bg-zinc-900" : "bg-gray-50"}`}>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12 animate-fade-in">
                        <h2 className="text-4xl font-bold mb-8">Our Story</h2>
                        <p className={`text-lg leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            {content.story}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4 md:px-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className={`p-8 rounded-lg transition-all duration-700 hover:shadow-xl transform hover:scale-105 ${isDark ? "bg-zinc-900 hover:bg-zinc-800" : "bg-gray-100 hover:bg-gray-200"}`}>
                            <div className="text-5xl mb-4">🎯</div>
                            <h3 className="text-3xl font-bold mb-4">{content.missionTitle}</h3>
                            <p className={`text-lg leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                {content.missionDescription}
                            </p>
                        </div>

                        {/* Vision */}
                        <div className={`p-8 rounded-lg transition-all duration-700 hover:shadow-xl transform hover:scale-105 ${isDark ? "bg-zinc-900 hover:bg-zinc-800" : "bg-gray-100 hover:bg-gray-200"}`}>
                            <div className="text-5xl mb-4">🌟</div>
                            <h3 className="text-3xl font-bold mb-4">{content.visionTitle}</h3>
                            <p className={`text-lg leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                {content.visionDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={`py-20 px-4 md:px-20 ${isDark ? "bg-zinc-900" : "bg-gray-50"}`}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center">Our Core Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {content.values.map((value, index) => (
                            <div
                                key={index}
                                className={`p-6 rounded-lg text-center transition-all duration-500 transform hover:scale-110 hover:shadow-xl ${isDark ? "bg-black" : "bg-white"}`}
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <div className="text-5xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`py-20 px-4 md:px-20 text-center ${isDark ? "bg-black" : "bg-white"}`}>
                <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Discover the finest collection of clothing tailored for your lifestyle
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-900"}`}
                    >
                        Start Shopping
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/contact")}
                        className={`px-8 py-3 rounded-lg border font-bold transition-all duration-300 transform hover:scale-105 ${isDark ? "border-white text-white hover:bg-white hover:text-black" : "border-black text-black hover:bg-black hover:text-white"}`}
                    >
                        Contact Support
                    </button>
                </div>
            </section>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fadeInUp 0.8s ease-out;
                }
            `}</style>
        </div>
    );
}

export default About;
