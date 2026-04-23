import { Link } from "react-router-dom";

function Footer({ isDark }) {
    const sectionCardClass = isDark
        ? "rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
        : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4";

    return (
        <footer className={isDark ? "border-t border-zinc-800 bg-black py-10 transition-colors duration-500 md:py-12" : "border-t border-zinc-300 bg-white py-10 transition-colors duration-500 md:py-12"}>
            <div className={isDark ? "mx-auto w-[96%] max-w-[1320px] text-zinc-300" : "mx-auto w-[96%] max-w-[1320px] text-zinc-700"}>
                <div className="grid gap-5 sm:gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
                    <div className={sectionCardClass}>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] opacity-70">Karthick Cloths</p>
                        <p className="mt-3 max-w-xs text-sm leading-6 md:text-[16px] md:leading-7">
                            Everyday essentials and elevated fashion for men, women, and kids. Designed for comfort, crafted for style.
                        </p>
                        <p className={isDark ? "mt-4 text-xs text-zinc-400" : "mt-4 text-xs text-zinc-500"}>
                            GSTIN: 33ABCDE1234F1Z5
                        </p>
                    </div>

                    <div className={sectionCardClass}>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Location</h3>
                        <ul className="mt-3 space-y-3 text-sm leading-6">
                            <li>
                                <p className="font-semibold">Main Store</p>
                                <p>No. 24, Bazaar Street, Erode, Tamil Nadu - 638001</p>
                            </li>
                            <li>
                                <p className="font-semibold">Warehouse</p>
                                <p>SIPCOT Road, Perundurai, Tamil Nadu - 638052</p>
                            </li>
                        </ul>
                    </div>

                    <div className={sectionCardClass}>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Page Indicators</h3>
                        <div className="mt-3 grid grid-cols-1 gap-x-3 gap-y-2 text-sm sm:grid-cols-2">
                            <Link to="/" className="transition hover:underline">Home</Link>
                            <Link to="/men" className="transition hover:underline">Men Wears</Link>
                            <Link to="/women" className="transition hover:underline">Women Wears</Link>
                            <Link to="/kids" className="transition hover:underline">Kids Wears</Link>
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
                                <span className="font-semibold">Phone:</span> +91 98765 43210
                            </li>
                            <li>
                                <span className="font-semibold">WhatsApp:</span> +91 98765 43210
                            </li>
                            <li>
                                <span className="font-semibold">Email:</span> support@karthickcloths.in
                            </li>
                            <li>
                                <span className="font-semibold">Working Hours:</span> Mon-Sat, 9:30 AM to 8:30 PM
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={isDark ? "mt-8 flex flex-col items-center gap-3 border-t border-zinc-800 pt-5 text-center text-xs text-zinc-400 md:mt-10 md:flex-row md:justify-between md:text-left" : "mt-8 flex flex-col items-center gap-3 border-t border-zinc-300 pt-5 text-center text-xs text-zinc-500 md:mt-10 md:flex-row md:justify-between md:text-left"}>
                    <p className="leading-5">2026 Ktshirts. All rights reserved.</p>
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