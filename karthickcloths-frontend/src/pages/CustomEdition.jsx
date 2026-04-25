import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createCustomEditionRequest } from "../services/api";

const initialForm = {
    fullName: "",
    contactEmail: "",
    phoneNumber: "",
    tshirtType: "Round Neck",
    quantity: 1,
    sizePreference: "M",
    colorPreference: "Black",
    designDescription: "",
    imageUrl: "",
    notes: "",
};

function CustomEdition({ isDark }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            fullName: user?.fullName || prev.fullName,
            contactEmail: user?.email || prev.contactEmail,
            phoneNumber: user?.phoneNumber || prev.phoneNumber,
        }));
    }, [isAuthenticated, user?.fullName, user?.phoneNumber]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
        setError(null);
        setMessage(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }
        if (!formData.designDescription.trim()) {
            setError("Please provide your design details");
            return;
        }
        if (!formData.contactEmail.trim() && !formData.phoneNumber.trim()) {
            setError("Please provide either an email address or a phone number.");
            return;
        }
        if (formData.imageUrl.trim() && !/^https?:\/\/\S+$/i.test(formData.imageUrl.trim())) {
            setError("Please provide a valid image URL starting with http:// or https://");
            return;
        }

        setLoading(true);
        try {
            const response = await createCustomEditionRequest(formData, token);
            const createdRequest = response?.data || response;
            const orderId = createdRequest?.orderId;
            if (!orderId) {
                throw new Error("Unable to generate order ID");
            }
            setMessage(`Request submitted successfully. Order ID: ${orderId}. You can track updates in the Track Orders page.`);
            setFormData((prev) => ({
                ...prev,
                tshirtType: "Round Neck",
                quantity: 1,
                sizePreference: "M",
                colorPreference: "Black",
                designDescription: "",
                imageUrl: "",
                notes: "",
            }));
        } catch (err) {
            setError(err.message || "Unable to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={isDark ? "min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100" : "min-h-screen bg-zinc-50 px-4 py-12 text-zinc-900"}>
            <section className="mx-auto max-w-6xl">
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className={isDark ? "rounded-[2rem] border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl shadow-black/30" : "rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-200/70"}>
                        <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-500">
                            Custom Edition Request
                        </div>
                        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Bring your concept to life.</h1>
                        <p className={isDark ? "mt-4 max-w-2xl text-sm leading-7 text-zinc-300" : "mt-4 max-w-2xl text-sm leading-7 text-zinc-600"}>
                            Submit your idea, add a reference image URL, and we’ll create a unique order ID for tracking. When the order is approved, you can move it straight to cart for checkout.
                        </p>

                        <div className={isDark ? "mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300" : "mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600"}>
                            Need help? Use the tracking page anytime after submission.
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Full Name</span>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none placeholder:text-zinc-400 dark:border-zinc-700" placeholder="Your name" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Email</span>
                                <input name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none placeholder:text-zinc-400 dark:border-zinc-700" placeholder="name@example.com" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Phone</span>
                                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none placeholder:text-zinc-400 dark:border-zinc-700" placeholder="Mobile number" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">T-Shirt Type</span>
                                <select name="tshirtType" value={formData.tshirtType} onChange={handleChange} className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none dark:border-zinc-700">
                                    <option>Round Neck</option>
                                    <option>Oversized</option>
                                    <option>Polo</option>
                                    <option>Full Sleeve</option>
                                    <option>Hooded</option>
                                </select>
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Color</span>
                                <input name="colorPreference" value={formData.colorPreference} onChange={handleChange} className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none placeholder:text-zinc-400 dark:border-zinc-700" placeholder="Black, white, navy..." />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Size</span>
                                <input name="sizePreference" value={formData.sizePreference} onChange={handleChange} className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none placeholder:text-zinc-400 dark:border-zinc-700" placeholder="S, M, L, XL..." />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Quantity</span>
                                <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none dark:border-zinc-700" />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Reference Image URL</span>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-zinc-400 dark:border-zinc-700"
                                    placeholder="https://example.com/design-reference.jpg"
                                />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Design Description</span>
                                <textarea name="designDescription" value={formData.designDescription} onChange={handleChange} rows="5" className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none placeholder:text-zinc-400 dark:border-zinc-700" placeholder="Describe the concept, artwork, text, placement, or reference details." />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Extra Notes</span>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none placeholder:text-zinc-400 dark:border-zinc-700" placeholder="Any deadline, fit, or production notes" />
                            </label>

                            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                                <button type="submit" disabled={loading} className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60">
                                    {loading ? "Submitting..." : "Submit Custom Request"}
                                </button>
                                <Link to="/custom-edition/track" className={isDark ? "rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700"}>
                                    Track an Order
                                </Link>
                            </div>

                            {error ? <p className="md:col-span-2 text-sm font-medium text-red-500">{error}</p> : null}
                            {message ? <p className="md:col-span-2 text-sm font-medium text-green-500">{message}</p> : null}
                        </form>

                    </div>

                    <aside className={isDark ? "rounded-[2rem] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6" : "rounded-[2rem] border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-6"}>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-500">How it works</p>
                        <div className="mt-5 space-y-4 text-sm leading-7">
                            <div className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-900 p-4" : "rounded-2xl border border-zinc-200 bg-white p-4"}>
                                1. Submit your custom design request with a reference image URL and size details.
                            </div>
                            <div className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-900 p-4" : "rounded-2xl border border-zinc-200 bg-white p-4"}>
                                2. Admin reviews the order, shares preview, and updates to REVIEWED or REJECTED.
                            </div>
                            <div className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-900 p-4" : "rounded-2xl border border-zinc-200 bg-white p-4"}>
                                3. If reviewed, confirm in Track Orders page to continue payment and delivery.
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

export default CustomEdition;
