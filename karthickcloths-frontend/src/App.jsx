import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import MenWear from "./pages/MenSection/MenWear";
import MenWearProductDetails from "./pages/MenSection/MenWearProductDetails";
import WomenWear from "./pages/WomenSection/WomenWear";
import WomenWearProductDetails from "./pages/WomenSection/WomenWearProductDetails";
import KidsWear from "./pages/KidsSection/KidsWear";
import KidsWearProductDetails from "./pages/KidsSection/KidsWearProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/Footer";

function App() {
    const [isDark, setIsDark] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTheme = localStorage.getItem("kc-theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;

        setIsDark(shouldUseDark);
        document.documentElement.classList.toggle("dark", shouldUseDark);
    }, []);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            document.documentElement.classList.toggle("dark", next);
            localStorage.setItem("kc-theme", next ? "dark" : "light");
            return next;
        });
    };

    return (
        <div className={isDark ? "min-h-screen overflow-x-hidden bg-black pb-[78px] pt-[88px] text-zinc-100 transition-colors duration-500 lg:pb-0 lg:pt-[116px]" : "min-h-screen overflow-x-hidden bg-white pb-[78px] pt-[88px] text-zinc-900 transition-colors duration-500 lg:pb-0 lg:pt-[116px]"}>
            <Navbar isDark={isDark} onToggleTheme={toggleTheme} />
            <Routes>
                <Route path="/" element={<HomePage isDark={isDark} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/men"
                    element={<MenWear isDark={isDark} onSelectProduct={(productId) => navigate(`/men/${productId}/details`)} />}
                />
                <Route path="/men/:prod_id/details" element={<MenWearProductDetails isDark={isDark} />} />
                <Route
                    path="/women"
                    element={<WomenWear isDark={isDark} onSelectProduct={(productId) => navigate(`/women/${productId}/details`)} />}
                />
                <Route path="/women/:prod_id/details" element={<WomenWearProductDetails isDark={isDark} />} />
                <Route
                    path="/kids"
                    element={<KidsWear isDark={isDark} onSelectProduct={(productId) => navigate(`/kids/${productId}/details`)} />}
                />
                <Route path="/kids/:prod_id/details" element={<KidsWearProductDetails isDark={isDark} />} />
                <Route path="/search" element={<Search isDark={isDark} />} />
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart isDark={isDark} />
                        </ProtectedRoute>
                    }
                />
                <Route path="/contact" element={<Contact isDark={isDark} />} />
                <Route path="/wishlist" element={<Wishlist isDark={isDark} />} />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile isDark={isDark} />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer isDark={isDark} />
        </div>
    );
}

export default App;