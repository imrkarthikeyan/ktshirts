import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
import AdminDashboard from "./pages/Admin/AdminDashboard";
import HandleHome from "./pages/Admin/HandleHome";
import HandleFooter from "./pages/Admin/HandleFooter";
import HandleContact from "./pages/Admin/HandleContact";
import HandleAbout from "./pages/Admin/HandleAbout";
import HandleTerms from "./pages/Admin/HandleTerms";
import CustomEditionOrders from "./pages/Admin/CustomEditionOrders";
import ConstitutionalEdition from "./pages/ConstitutionalEdition/ConstitutionalEdition";
import ConstitutionalEditionProductDetails from "./pages/ConstitutionalEdition/ConstitutionalEditionProductDetails";
import CustomEdition from "./pages/CustomEdition";
import CustomEditionSuccess from "./pages/CustomEditionSuccess";
import CustomEditionTracking from "./pages/CustomEditionTracking";
import HomeProductDetails from "./pages/HomeProductDetails";
import StoreLocator from "./pages/StoreLocator";
import About from "./pages/About";
import Terms from "./pages/Terms";

function App() {
    const [isDark, setIsDark] = useState(() => {
        const storedTheme = localStorage.getItem("kc-theme");
        return storedTheme ? storedTheme === "dark" : true;
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedTheme = localStorage.getItem("kc-theme");
        const shouldUseDark = storedTheme ? storedTheme === "dark" : true;

        setIsDark(shouldUseDark);
        document.documentElement.classList.toggle("dark", shouldUseDark);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

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
                <Route path="/home-product/:prod_id/details" element={<HomeProductDetails isDark={isDark} />} />
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
                <Route
                    path="/constitutional-edition"
                    element={<ConstitutionalEdition isDark={isDark} onSelectProduct={(productId) => navigate(`/constitutional-edition/${productId}/details`)} />}
                />
                <Route path="/constitutional-edition/:prod_id/details" element={<ConstitutionalEditionProductDetails isDark={isDark} />} />
                <Route
                    path="/custom-edition"
                    element={
                        <ProtectedRoute>
                            <CustomEdition isDark={isDark} />
                        </ProtectedRoute>
                    }
                />
                <Route path="/custom-edition/success/:orderId" element={<CustomEditionSuccess isDark={isDark} />} />
                <Route path="/custom-edition/track" element={<CustomEditionTracking isDark={isDark} />} />
                <Route path="/store-locator" element={<StoreLocator isDark={isDark} />} />
                <Route path="/search" element={<Search isDark={isDark} />} />
                <Route path="/about" element={<About isDark={isDark} />} />
                <Route path="/terms" element={<Terms isDark={isDark} />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requireAdmin>
                            <AdminDashboard isDark={isDark} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/handle-footer"
                    element={
                        <ProtectedRoute requireAdmin>
                            <HandleFooter isDark={isDark} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/handle-contact"
                    element={
                        <ProtectedRoute requireAdmin>
                            <HandleContact isDark={isDark} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/handle-home"
                    element={
                        <ProtectedRoute requireAdmin>
                            <HandleHome isDark={isDark} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/handle-about"
                    element={
                        <ProtectedRoute requireAdmin>
                            <HandleAbout isDark={isDark} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/handle-terms"
                    element={
                        <ProtectedRoute requireAdmin>
                            <HandleTerms isDark={isDark} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/custom-edition"
                    element={
                        <ProtectedRoute requireAdmin>
                            <CustomEditionOrders isDark={isDark} />
                        </ProtectedRoute>
                    }
                />
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