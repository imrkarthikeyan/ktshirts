import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar({ isDark, onToggleTheme }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount } = useCart();
    const { wishlistCount } = useWishlist();
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!mobileMenuOpen) {
            return;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [mobileMenuOpen]);

    const openMobileMenu = () => {
        setMobileMenuOpen(true);
        setProfileOpen(false);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const handleNavigate = (path) => {
        navigate(path);
        closeMobileMenu();
        setProfileOpen(false);
    };

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        closeMobileMenu();
        navigate("/");
    };

    const handleAuthClick = () => {
        if (isAuthenticated) {
            setProfileOpen(!profileOpen);
        } else {
            navigate("/login", { state: { from: location } });
        }
    };

    const handleMobileProfileClick = () => {
        handleNavigate(isAuthenticated ? "/profile" : "/login");
    };

    const handleSearchSubmit = () => {
        const trimmedSearch = searchTerm.trim();
        navigate(trimmedSearch ? `/search?q=${encodeURIComponent(trimmedSearch)}` : "/search");
        setSearchTerm("");
        setProfileOpen(false);
        closeMobileMenu();
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearchSubmit();
        }
    };

    return (
        <header className="fixed left-0 right-0 top-0 z-50">
            <div className={isDark ? "hidden bg-white text-xs text-zinc-900 lg:block" : "hidden bg-black text-xs text-white lg:block"}>
                <div className="mx-auto flex min-h-[25px] w-[96%] max-w-[1420px] items-center justify-between gap-4">
                    <div className="hidden flex-wrap items-center gap-3 sm:flex">
                        <a href="#" className={isDark ? "transition hover:text-zinc-600" : "transition hover:text-zinc-300"}>GREENCARD</a>
                        <a href="#" className={isDark ? "transition hover:text-zinc-600" : "transition hover:text-zinc-300"}>GIFT CARD</a>
                        <button type="button" onClick={() => navigate("/store-locator")} className={isDark ? "transition hover:text-zinc-600" : "transition hover:text-zinc-300"}>STORE LOCATOR</button>
                        <button type="button" onClick={() => navigate("/custom-edition/track")} className={isDark ? "transition hover:text-zinc-600" : "transition hover:text-zinc-300"}>TRACK ORDER</button>
                    </div>
                    <div className="flex items-center gap-2 font-semibold">
                        <span>ENTIRE COLLECTION</span>
                        <button
                            type="button"
                            onClick={onToggleTheme}
                            className={isDark ? "rounded-full border border-zinc-900 bg-black px-2 py-[2px] text-[10px] text-white transition hover:bg-zinc-800" : "rounded-full border border-zinc-300 bg-white px-2 py-[2px] text-[10px] text-zinc-900 transition hover:bg-zinc-100"}
                        >
                            {isDark ? "LIGHT" : "DARK"}
                        </button>
                        <span>{isDark ? "DARK MODE" : "LIGHT MODE"}</span>
                    </div>
                </div>
            </div>

            <div className={isDark ? "border-b border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] text-zinc-300 lg:hidden" : "border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] text-zinc-600 lg:hidden"}>
                <div className="mx-auto flex max-w-[1320px] items-center justify-between">
                    <span className="truncate">New drops. Fresh edits landing now.</span>
                    <button
                        type="button"
                        onClick={onToggleTheme}
                        className={isDark ? "ml-3 rounded-full border border-zinc-700 px-2 py-1 text-[10px] font-semibold text-zinc-200" : "ml-3 rounded-full border border-zinc-300 px-2 py-1 text-[10px] font-semibold text-zinc-700"}
                    >
                        {isDark ? "LIGHT" : "DARK"}
                    </button>
                </div>
            </div>

            <div className={isDark ? "border-b border-zinc-800 bg-black/95 px-3 py-3 backdrop-blur-md lg:hidden" : "border-b border-zinc-200 bg-white/95 px-3 py-3 backdrop-blur-md lg:hidden"}>
                <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={openMobileMenu}
                        className={isDark ? "rounded-lg border border-zinc-700 px-2 py-1 text-lg text-zinc-100" : "rounded-lg border border-zinc-300 px-2 py-1 text-lg text-zinc-900"}
                        aria-label="Open menu"
                    >
                        ≡
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className={isDark ? "text-2xl font-semibold uppercase leading-none tracking-[0.08em] text-zinc-100" : "text-2xl font-semibold uppercase leading-none tracking-[0.08em] text-zinc-900"}
                    >
                        TRIAL BY TSHIRT
                    </button>

                    <div className="flex items-center gap-3">
                        <button type="button" className="text-xl" aria-label="Search" onClick={handleSearchSubmit}>⌕</button>
                        <button type="button" className="relative text-xl" aria-label="Wishlist" onClick={() => navigate("/wishlist")}>
                            ♡
                            {wishlistCount > 0 ? (
                                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-white">
                                    {wishlistCount}
                                </span>
                            ) : null}
                        </button>
                        <button type="button" className="relative text-xl" aria-label="Cart" onClick={() => isAuthenticated && navigate("/cart")}>
                            🛒
                            {isAuthenticated && itemCount > 0 ? (
                                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                                    {itemCount}
                                </span>
                            ) : null}
                        </button>
                    </div>
                </div>
            </div>

            <nav className={isDark ? "hidden bg-black/95 backdrop-blur-md lg:block" : "hidden bg-white/95 backdrop-blur-md lg:block"}>
                <div className="mx-auto flex min-h-[80px] w-[96%] max-w-[1320px] items-center justify-between gap-3">
                    <div className={isDark ? "hidden cursor-pointer text-[28px] font-semibold uppercase leading-none tracking-[0.1em] text-zinc-100 transition hover:text-cyan-400 md:text-[34px] lg:block" : "hidden cursor-pointer text-[28px] font-semibold uppercase leading-none tracking-[0.1em] text-zinc-900 transition hover:text-cyan-600 md:text-[34px] lg:block"} onClick={() => navigate("/")}>
                        TRIAL BY TSHIRT
                    </div>

                    <ul className={isDark ? "hidden list-none items-center gap-8 p-0 text-[13px] tracking-[0.5px] text-zinc-300 lg:flex" : "hidden list-none items-center gap-8 p-0 text-[13px] tracking-[0.5px] text-zinc-700 lg:flex"}>
                        {/* <li className="cursor-pointer transition hover:text-white dark:hover:text-white" onClick={() => navigate("/women")}>WOMEN</li> */}
                        {/* <li className="cursor-pointer transition hover:text-white dark:hover:text-white" onClick={() => navigate("/men")}>MEN</li> */}
                        {/* <li className="cursor-pointer transition hover:text-white dark:hover:text-white" onClick={() => navigate("/kids")}>KIDS</li> */}
                        <li className="cursor-pointer transition hover:text-white dark:hover:text-white" onClick={() => navigate("/constitutional-edition")}>CONSTITUTIONAL EDITION</li>
                        <li className="cursor-pointer transition hover:text-white dark:hover:text-white" onClick={() => navigate("/custom-edition")}>CUSTOM EDITION</li>
                        <li className="cursor-pointer transition hover:text-white dark:hover:text-white" onClick={() => navigate("/custom-edition/track")}>TRACK ORDER</li>
                        <li className="cursor-pointer transition hover:text-white dark:hover:text-white" onClick={() => navigate("/about")}>ABOUT</li>
                    </ul>

                    <div className="relative hidden items-center gap-3 lg:flex">
                        <div className={isDark ? "flex items-center gap-1.5 border-b border-zinc-400 pb-1 text-zinc-300" : "flex items-center gap-1.5 border-b border-zinc-400 pb-1 text-zinc-700"}>
                            <span>🔍</span>
                            <input
                                type="text"
                                placeholder="Search"
                                className={isDark ? "w-28 border-0 bg-transparent text-[13px] outline-none placeholder:text-zinc-400" : "w-28 border-0 bg-transparent text-[13px] outline-none placeholder:text-zinc-500"}
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                            <button type="button" className="text-[13px] font-semibold" onClick={handleSearchSubmit}>Go</button>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/wishlist")}
                            className="relative cursor-pointer text-[17px] leading-none transition hover:scale-110"
                            aria-label="Wishlist"
                        >
                            ♡
                            {wishlistCount > 0 ? (
                                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-white">
                                    {wishlistCount}
                                </span>
                            ) : null}
                        </button>

                        {/* Cart Icon */}
                        <div className="relative cursor-pointer" onClick={() => isAuthenticated && navigate("/cart")}>
                            <span className="text-[17px] leading-none transition hover:scale-110">
                                🛒
                            </span>
                            {isAuthenticated && itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={handleAuthClick}
                                className="cursor-pointer text-[17px] leading-none transition hover:scale-110"
                                type="button"
                            >
                                👤
                            </button>

                            {/* Profile Dropdown */}
                            {isAuthenticated && profileOpen && (
                                <div className={isDark ? "absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-lg shadow-lg z-50" : "absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50"}>
                                    <div className={isDark ? "px-4 py-3 border-b border-zinc-200" : "px-4 py-3 border-b border-gray-700"}>
                                        <p className={isDark ? "text-sm font-bold text-black" : "text-sm font-bold text-white"}>
                                            {user?.fullName}
                                        </p>
                                        <p className={isDark ? "text-xs text-zinc-600" : "text-xs text-gray-400"}>
                                            {user?.email}
                                        </p>
                                    </div>

                                    <div className={isDark ? "py-2" : "py-2"}>
                                        {(user?.admin || user?.isAdmin) ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        navigate("/admin");
                                                        setProfileOpen(false);
                                                    }}
                                                    className={isDark ? "block w-full text-left px-4 py-2 text-sm text-black hover:bg-zinc-100 transition" : "block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition"}
                                                >
                                                    ⚙ Admin Dashboard
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate("/admin/custom-edition");
                                                        setProfileOpen(false);
                                                    }}
                                                    className={isDark ? "block w-full text-left px-4 py-2 text-sm text-black hover:bg-zinc-100 transition" : "block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition"}
                                                >
                                                    📋 Handle Custom Edition Requests
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate("/admin/handle-footer");
                                                        setProfileOpen(false);
                                                    }}
                                                    className={isDark ? "block w-full text-left px-4 py-2 text-sm text-black hover:bg-zinc-100 transition" : "block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition"}
                                                >
                                                    🧾 Handle Footer
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate("/admin/handle-contact");
                                                        setProfileOpen(false);
                                                    }}
                                                    className={isDark ? "block w-full text-left px-4 py-2 text-sm text-black hover:bg-zinc-100 transition" : "block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition"}
                                                >
                                                    ✉ Handle Contact
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate("/admin/handle-home");
                                                        setProfileOpen(false);
                                                    }}
                                                    className={isDark ? "block w-full text-left px-4 py-2 text-sm text-black hover:bg-zinc-100 transition" : "block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition"}
                                                >
                                                    🏠 Handle Home
                                                </button>
                                            </>
                                        ) : null}
                                        <button
                                            onClick={() => {
                                                navigate("/profile");
                                                setProfileOpen(false);
                                            }}
                                            className={isDark ? "block w-full text-left px-4 py-2 text-sm text-black hover:bg-zinc-100 transition" : "block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition"}
                                        >
                                            👤 My Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/cart");
                                                setProfileOpen(false);
                                            }}
                                            className={isDark ? "block w-full text-left px-4 py-2 text-sm text-black hover:bg-zinc-100 transition" : "block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition"}
                                        >
                                            🛒 My Cart
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/contact");
                                                setProfileOpen(false);
                                            }}
                                            className={isDark ? "block w-full text-left px-4 py-2 text-sm text-black hover:bg-zinc-100 transition" : "block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition"}
                                        >
                                            ✉ Contact
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/men");
                                                setProfileOpen(false);
                                            }}
                                            className={isDark ? "block w-full text-left px-4 py-2 text-sm text-black hover:bg-zinc-100 transition" : "block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition"}
                                        >
                                            👕 Continue Shopping
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className={isDark ? "block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 transition border-t border-zinc-200" : "block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition border-t border-gray-700"}
                                        >
                                            🚪 Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {mobileMenuOpen ? (
                <div className="fixed inset-0 z-[70] lg:hidden" aria-modal="true" role="dialog">
                    <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="absolute inset-0 bg-black/45"
                        aria-label="Close menu"
                    />
                    <aside className={isDark ? "relative h-full w-[86%] max-w-[360px] overflow-y-auto border-r border-zinc-700 bg-zinc-950" : "relative h-full w-[86%] max-w-[360px] overflow-y-auto border-r border-zinc-200 bg-white"}>
                        <div className={isDark ? "flex items-center justify-between border-b border-zinc-800 px-4 py-4" : "flex items-center justify-between border-b border-zinc-200 px-4 py-4"}>
                            <p className="text-sm font-semibold">Welcome</p>
                            {isAuthenticated ? (
                                <button
                                    type="button"
                                    onClick={() => handleNavigate("/profile")}
                                    className="rounded-full bg-cyan-600 px-4 py-1.5 text-xs font-semibold text-white"
                                >
                                    My Profile
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeMobileMenu();
                                        navigate("/login", { state: { from: location } });
                                    }}
                                    className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white"
                                >
                                    Login / Register
                                </button>
                            )}
                        </div>

                        <div className="px-4 py-3">
                            {/* <button onClick={() => handleNavigate("/women")} className={isDark ? "flex w-full items-center justify-between border-b border-zinc-800 py-4 text-left text-xl text-zinc-100" : "flex w-full items-center justify-between border-b border-zinc-200 py-4 text-left text-xl text-zinc-900"}>WOMEN <span className="text-2xl">+</span></button> */}
                            {/* <button onClick={() => handleNavigate("/men")} className={isDark ? "flex w-full items-center justify-between border-b border-zinc-800 py-4 text-left text-xl text-zinc-100" : "flex w-full items-center justify-between border-b border-zinc-200 py-4 text-left text-xl text-zinc-900"}>MEN <span className="text-2xl">+</span></button> */}
                            {/* <button onClick={() => handleNavigate("/kids")} className={isDark ? "flex w-full items-center justify-between border-b border-zinc-800 py-4 text-left text-xl text-zinc-100" : "flex w-full items-center justify-between border-b border-zinc-200 py-4 text-left text-xl text-zinc-900"}>KIDS <span className="text-2xl">+</span></button> */}
                            <button onClick={() => handleNavigate("/constitutional-edition")} className={isDark ? "flex w-full items-center justify-between border-b border-zinc-800 py-4 text-left text-xl text-zinc-100" : "flex w-full items-center justify-between border-b border-zinc-200 py-4 text-left text-xl text-zinc-900"}>CONSTITUTIONAL EDITION <span className="text-2xl">+</span></button>
                            <button onClick={() => handleNavigate("/custom-edition")} className={isDark ? "flex w-full items-center justify-between border-b border-zinc-800 py-4 text-left text-xl text-zinc-100" : "flex w-full items-center justify-between border-b border-zinc-200 py-4 text-left text-xl text-zinc-900"}>CUSTOM EDITION <span className="text-2xl">+</span></button>
                            <button onClick={() => handleNavigate("/custom-edition/track")} className={isDark ? "flex w-full items-center justify-between py-4 text-left text-xl text-zinc-100" : "flex w-full items-center justify-between py-4 text-left text-xl text-zinc-900"}>TRACK ORDER</button>
                            <button onClick={() => handleNavigate("/about")} className={isDark ? "flex w-full items-center justify-between border-t border-zinc-800 py-4 text-left text-xl text-zinc-100" : "flex w-full items-center justify-between border-t border-zinc-200 py-4 text-left text-xl text-zinc-900"}>ABOUT</button>
                        </div>

                        <div className={isDark ? "mt-2 border-t border-zinc-800 bg-zinc-900 px-4 py-4" : "mt-2 border-t border-zinc-200 bg-zinc-50 px-4 py-4"}>
                            <button onClick={() => handleNavigate("/profile")} className="block w-full py-2 text-left text-base">My Account</button>
                            {(user?.admin || user?.isAdmin) ? (
                                <>
                                    <button onClick={() => handleNavigate("/admin")} className="block w-full py-2 text-left text-base">Admin Dashboard</button>
                                    <button onClick={() => handleNavigate("/admin/custom-edition")} className="block w-full py-2 text-left text-base">Handle Custom Edition Requests</button>
                                    <button onClick={() => handleNavigate("/admin/handle-footer")} className="block w-full py-2 text-left text-base">Handle Footer</button>
                                    <button onClick={() => handleNavigate("/admin/handle-contact")} className="block w-full py-2 text-left text-base">Handle Contact</button>
                                    <button onClick={() => handleNavigate("/admin/handle-home")} className="block w-full py-2 text-left text-base">Handle Home</button>
                                </>
                            ) : null}
                            <button onClick={() => handleNavigate("/wishlist")} className="block w-full py-2 text-left text-base">My Wishlist</button>
                            <button onClick={() => handleNavigate("/custom-edition/track")} className="block w-full py-2 text-left text-base">Track Order</button>
                            <button onClick={() => handleNavigate("/contact")} className="block w-full py-2 text-left text-base">Contact</button>
                            <button onClick={() => handleNavigate("/store-locator")} className="block w-full py-2 text-left text-base">Store Locator</button>
                            {isAuthenticated ? (
                                <button onClick={handleLogout} className="mt-2 block w-full rounded-lg border border-red-400 px-3 py-2 text-left text-sm font-semibold text-red-500">Logout</button>
                            ) : null}
                        </div>
                    </aside>
                </div>
            ) : null}

            <div className={isDark ? "fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur lg:hidden" : "fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur lg:hidden"}>
                <div className="mx-auto grid max-w-[720px] grid-cols-5">
                    <button onClick={() => handleNavigate("/")} className="flex flex-col items-center gap-1 py-2 text-xs"><span className="text-xl">⌂</span><span>Home</span></button>
                    <button onClick={() => handleNavigate("/wishlist")} className="relative flex flex-col items-center gap-1 py-2 text-xs"><span className="text-xl">♡</span><span>Wishlist</span>{wishlistCount > 0 ? <span className="absolute right-5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-white">{wishlistCount}</span> : null}</button>
                    <button onClick={handleSearchSubmit} className="flex flex-col items-center gap-1 py-2 text-xs"><span className="text-xl">⌕</span><span>Search</span></button>
                    <button onClick={() => handleNavigate("/cart")} className="relative flex flex-col items-center gap-1 py-2 text-xs"><span className="text-xl">🛒</span><span>Cart</span>{isAuthenticated && itemCount > 0 ? <span className="absolute right-5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">{itemCount}</span> : null}</button>
                    <button onClick={handleMobileProfileClick} className="flex flex-col items-center gap-1 py-2 text-xs"><span className="text-xl">👤</span><span>Profile</span></button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;