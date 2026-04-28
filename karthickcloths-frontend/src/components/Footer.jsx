import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFooterSettings, syncFooterSettingsFromServer } from "../services/footerStore";

function Footer({ isDark }) {
    const [footerSettings, setFooterSettings] = useState(() => getFooterSettings());

    useEffect(() => {
        const syncFooterSettings = () => setFooterSettings(getFooterSettings());
        const loadFromServer = async () => {
            await syncFooterSettingsFromServer(true);
            syncFooterSettings();
        };

        syncFooterSettings();
        void loadFromServer();
        const intervalId = window.setInterval(() => {
            void loadFromServer();
        }, 15000);
        window.addEventListener("kc-footer-changed", syncFooterSettings);
        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("kc-footer-changed", syncFooterSettings);
        };
    }, []);

    const sectionCardClass = isDark
        ? "rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
        : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4";
    const { brandName, tagline, gstin, locations, contactDetails, copyrightText } = footerSettings;

    return (
        <footer className={isDark ? "border-t border-zinc-800 bg-black py-10 transition-colors duration-500 md:py-12" : "border-t border-zinc-300 bg-white py-10 transition-colors duration-500 md:py-12"}>
            <div className={isDark ? "mx-auto w-[96%] max-w-[1320px] text-zinc-300" : "mx-auto w-[96%] max-w-[1320px] text-zinc-700"}>
                <div className="grid gap-5 sm:gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
                    <div className={sectionCardClass}>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] opacity-70">{brandName}</p>
                        <p className="mt-3 max-w-xs text-sm leading-6 md:text-[16px] md:leading-7">
                            {tagline}
                        </p>
                        <p className={isDark ? "mt-4 text-xs text-zinc-400" : "mt-4 text-xs text-zinc-500"}>
                            GSTIN: {gstin}
                        </p>
                    </div>

                    <div className={sectionCardClass}>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Location</h3>
                        <ul className="mt-3 space-y-3 text-sm leading-6">
                            {locations.map((location) => (
                                <li key={`${location.label}-${location.address}`}>
                                    <p className="font-semibold">{location.label}</p>
                                    <p>{location.address}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={sectionCardClass}>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Page Indicators</h3>
                        <div className="mt-3 grid grid-cols-1 gap-x-3 gap-y-2 text-sm sm:grid-cols-2">
                            <Link to="/" className="transition hover:underline">Home</Link>
                            <Link to="/constitutional-edition" className="transition hover:underline">Constitution Edition</Link>
                            <Link to="/custom-edition" className="transition hover:underline">Custom Edition</Link>
                            <Link to="/custom-edition/track" className="transition hover:underline">Track Order</Link>
                            {/* <Link to="/women" className="transition hover:underline"></Link>
                            <Link to="/kids" className="transition hover:underline">Kids Wears</Link> */}
                            <Link to="/search" className="transition hover:underline">Search</Link>
                            <Link to="/wishlist" className="transition hover:underline">Wishlist</Link>
                            <Link to="/cart" className="transition hover:underline">My Cart</Link>
                            <Link to="/profile" className="transition hover:underline">My Account</Link>
                            <Link to="/contact" className="transition hover:underline">Contact</Link>
                        </div>
                    </div>

                    <div className={sectionCardClass}>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Contact Details</h3>
                        <ul className="mt-3 space-y-2 text-sm leading-6">
                            <li>
                                <span className="font-semibold">Phone:</span> {contactDetails.phone}
                            </li>
                            <li>
                                <span className="font-semibold">WhatsApp:</span> {contactDetails.whatsapp}
                            </li>
                            <li>
                                <span className="font-semibold">Email:</span> {contactDetails.email}
                            </li>
                            <li>
                                <span className="font-semibold">Working Hours:</span> {contactDetails.workingHours}
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={isDark ? "mt-8 flex flex-col items-center gap-3 border-t border-zinc-800 pt-5 text-center text-xs text-zinc-400 md:mt-10 md:flex-row md:justify-between md:text-left" : "mt-8 flex flex-col items-center gap-3 border-t border-zinc-300 pt-5 text-center text-xs text-zinc-500 md:mt-10 md:flex-row md:justify-between md:text-left"}>
                    <p className="leading-5">{copyrightText}</p>
                    <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end md:gap-4">
                        <a href="#" className="transition hover:underline">Privacy Policy</a>
                        <a href="#" className="transition hover:underline">Terms & Conditions</a>
                        <a href="#" className="transition hover:underline">Shipping & Returns</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;