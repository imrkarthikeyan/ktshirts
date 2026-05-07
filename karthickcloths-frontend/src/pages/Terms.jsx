import { useEffect, useState } from "react";
import { getTermsContent, syncTermsContentFromServer } from "../services/termsStore";

function Terms({ isDark }) {
    const [content, setContent] = useState(getTermsContent());
    const [expandedSection, setExpandedSection] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const loadContent = async () => {
            await syncTermsContentFromServer(true);
            setContent(getTermsContent());
        };
        loadContent();

        const handleContentChange = () => {
            setContent(getTermsContent());
        };

        window.addEventListener("kc-terms-changed", handleContentChange);
        return () => window.removeEventListener("kc-terms-changed", handleContentChange);
    }, []);

    return (
        <div className={isDark ? "min-h-screen bg-black text-white" : "min-h-screen bg-white text-black"}>
            {/* Hero Section */}
            <div className={`py-20 px-4 md:px-20 ${isDark ? "bg-zinc-900" : "bg-gray-100"}`}>
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                        {content.title}
                    </h1>
                    <p className={`text-lg transition-all duration-1000 delay-200 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Last Updated: {content.lastUpdated}
                    </p>
                    <div className={`mt-6 text-sm leading-relaxed max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        <p>Please read these terms and conditions carefully. By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </div>
                </div>
            </div>

            {/* Terms Sections */}
            <section className="py-16 px-4 md:px-20">
                <div className="max-w-4xl mx-auto">
                    {content.sections.map((section, index) => (
                        <div
                            key={section.id}
                            className={`mb-4 rounded-lg transition-all duration-500 overflow-hidden ${expandedSection === index ? isDark ? "bg-zinc-900" : "bg-gray-100" : isDark ? "bg-zinc-950" : "bg-gray-50"}`}
                            style={{
                                animation: `slideIn 0.6s ease-out ${index * 0.05}s both`
                            }}
                        >
                            <button
                                onClick={() => setExpandedSection(expandedSection === index ? -1 : index)}
                                className={`w-full p-6 flex items-center justify-between transition-all duration-300 hover:${isDark ? "bg-zinc-800" : "bg-gray-200"}`}
                            >
                                <h3 className="text-lg font-bold text-left">{section.title}</h3>
                                <div className={`text-2xl transition-transform duration-300 transform ${expandedSection === index ? "rotate-180" : ""}`}>
                                    ▼
                                </div>
                            </button>

                            {expandedSection === index && (
                                <div className={`px-6 pb-6 ${isDark ? "border-t border-zinc-800" : "border-t border-gray-300"} animate-expand`}>
                                    <p className={`text-base leading-relaxed whitespace-pre-line ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                        {section.content}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className={`py-16 px-4 md:px-20 ${isDark ? "bg-zinc-900" : "bg-gray-100"}`}>
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Questions About Our Terms?</h2>
                    <p className={`text-lg mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        If you have any questions or concerns about these terms and conditions, please don't hesitate to contact us.
                    </p>
                    <a
                        href="mailto:support@trialbytshirt.com"
                        className={`inline-block px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-900"}`}
                    >
                        Contact Support
                    </a>
                </div>
            </section>

            {/* Footer Notice */}
            <section className={`py-12 px-4 md:px-20 ${isDark ? "bg-black" : "bg-white"}`}>
                <div className="max-w-4xl mx-auto p-6 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
                    <p className={`text-sm text-center ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                        © 2024 Karthick Cloths. All rights reserved. These terms and conditions are subject to change without notice.
                    </p>
                </div>
            </section>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes expand {
                    from {
                        opacity: 0;
                        max-height: 0;
                    }
                    to {
                        opacity: 1;
                        max-height: 500px;
                    }
                }

                .animate-expand {
                    animation: expand 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default Terms;
