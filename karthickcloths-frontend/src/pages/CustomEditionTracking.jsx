import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cancelCustomEditionRequest, confirmCustomEditionRequest, convertCustomEditionToCart, fetchMyCustomEditionRequests } from "../services/api";

const statusStyles = {
    PENDING: "border-amber-200 bg-amber-100 text-amber-800",
    REVIEWED: "border-cyan-200 bg-cyan-100 text-cyan-800",
    APPROVED: "border-emerald-200 bg-emerald-100 text-emerald-800",
    REJECTED: "border-rose-200 bg-rose-100 text-rose-800",
    CANCELED: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

function CustomEditionTracking({ isDark }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, isAuthenticated } = useAuth();
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [requests, setRequests] = useState([]);
    const [decisionLoading, setDecisionLoading] = useState(false);

    const loadMyRequests = async () => {
        if (!token) {
            return;
        }

        setLoading(true);
        setError("");
        try {
            const data = await fetchMyCustomEditionRequests(token);
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Unable to load tracking details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated || !token) {
            return;
        }

        loadMyRequests();
        const intervalId = window.setInterval(() => {
            loadMyRequests();
        }, 20000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isAuthenticated, token]);

    const records = useMemo(() => {
        if (statusFilter === "ALL") {
            return requests;
        }
        return requests.filter((request) => (request.status || "").toUpperCase() === statusFilter);
    }, [requests, statusFilter]);

    const handleCheckout = async (trackedOrderId, alreadyConverted = false) => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }

        if (alreadyConverted) {
            navigate("/cart");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            await convertCustomEditionToCart(trackedOrderId, token);
            navigate("/cart");
        } catch (err) {
            setError(err.message || "Unable to move approved request to cart");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDesign = async (trackedOrderId) => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }

        setDecisionLoading(true);
        setError("");
        setMessage("");

        try {
            await confirmCustomEditionRequest(trackedOrderId, token);
            setMessage("Design confirmed. Your order has been moved to cart for payment and delivery.");
            navigate("/cart");
        } catch (err) {
            setError(err.message || "Unable to confirm design");
        } finally {
            setDecisionLoading(false);
        }
    };

    const handleCancelDesign = async (trackedOrderId) => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }

        setDecisionLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await cancelCustomEditionRequest(trackedOrderId, token);
            const updatedRequest = response?.data || null;
            setMessage("Custom request canceled.");
            if (updatedRequest) {
                setRequests((prev) => prev.map((item) => (item.orderId === updatedRequest.orderId ? updatedRequest : item)));
            }
        } catch (err) {
            setError(err.message || "Unable to cancel request");
        } finally {
            setDecisionLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <main className={isDark ? "min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100" : "min-h-screen bg-zinc-50 px-4 py-12 text-zinc-900"}>
                <section className="mx-auto max-w-4xl">
                    <div className={isDark ? "rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8 text-center" : "rounded-[2rem] border border-zinc-200 bg-white p-8 text-center"}>
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-500">Track Orders</p>
                        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Login to view your requests</h1>
                        <p className={isDark ? "mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-300" : "mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600"}>
                            Track Orders displays all your submitted custom requests with live status updates.
                        </p>
                        <button type="button" onClick={() => navigate("/login", { state: { from: location } })} className="mt-6 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">
                            Login to Continue
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className={isDark ? "min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100" : "min-h-screen bg-zinc-50 px-4 py-12 text-zinc-900"}>
            <section className="mx-auto max-w-5xl">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-500">Track Request</p>
                    <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">All your custom requests</h1>
                    <p className={isDark ? "mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-300" : "mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-600"}>
                        View every submitted custom request with live updates. Filters help you quickly check pending, reviewed, approved, and rejected requests.
                    </p>
                </div>

                <div className={isDark ? "mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6" : "mt-8 rounded-[2rem] border border-zinc-200 bg-white p-6"}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                            {["ALL", "PENDING", "REVIEWED", "APPROVED", "REJECTED"].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(status)}
                                    className={statusFilter === status
                                        ? "rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-white"
                                        : isDark
                                            ? "rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300"
                                            : "rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700"}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button type="button" onClick={loadMyRequests} className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600">
                            Refresh
                        </button>
                    </div>
                    <p className={isDark ? "mt-4 text-xs text-zinc-400" : "mt-4 text-xs text-zinc-600"}>
                        Live updates enabled. Requests auto-refresh every 20 seconds.
                    </p>
                    {message ? <p className="mt-3 text-sm font-medium text-green-500">{message}</p> : null}
                    {error ? <p className="mt-3 text-sm font-medium text-red-500">{error}</p> : null}
                </div>

                <div className="mt-8 space-y-4">
                    {loading ? (
                        <div className={isDark ? "rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-400" : "rounded-[2rem] border border-zinc-200 bg-white p-6 text-sm text-zinc-600"}>
                            Loading custom requests...
                        </div>
                    ) : null}

                    {!loading && records.length === 0 ? (
                        <div className={isDark ? "rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-400" : "rounded-[2rem] border border-zinc-200 bg-white p-6 text-sm text-zinc-600"}>
                            No requests found for the selected filter.
                        </div>
                    ) : null}

                    {records.map((request, index) => (
                        <article key={request.id || request.orderId} style={{ animationDelay: `${Math.min(index * 70, 560)}ms` }} className={isDark ? "animate-fade-up rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6" : "animate-fade-up rounded-[2rem] border border-zinc-200 bg-white p-6"}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">Order ID</p>
                                    <h2 className="mt-2 text-2xl font-semibold">{request.orderId}</h2>
                                </div>
                                <span className={`rounded-full border px-4 py-2 text-xs font-semibold ${statusStyles[request.status] || "border-zinc-300 bg-zinc-100 text-zinc-700"}`}>
                                    {request.status || "PENDING"}
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_240px]">
                                <div className="space-y-3 text-sm">
                                    <p><span className="font-semibold">Name:</span> {request.fullName}</p>
                                    <p><span className="font-semibold">Type:</span> {request.tshirtType}</p>
                                    <p><span className="font-semibold">Color:</span> {request.colorPreference || "-"}</p>
                                    <p><span className="font-semibold">Size:</span> {request.sizePreference || "-"}</p>
                                    <p><span className="font-semibold">Quantity:</span> {request.quantity}</p>
                                    <p><span className="font-semibold">Price:</span> {typeof request.price === "number" ? `₹${request.price}` : "Pending"}</p>
                                    <p><span className="font-semibold">Admin Response:</span> {request.adminResponse || "Awaiting response"}</p>
                                    <p><span className="font-semibold">Customer Decision:</span> {request.customerDecision || "-"}</p>
                                </div>
                                <div>
                                    {request.designPreviewUrl ? (
                                        <img src={request.designPreviewUrl} alt={`${request.orderId} design preview`} className="h-56 w-full rounded-2xl object-cover" />
                                    ) : request.imageUrl ? (
                                        <img src={request.imageUrl} alt={request.orderId} className="h-56 w-full rounded-2xl object-cover" />
                                    ) : (
                                        <div className={isDark ? "flex h-56 items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 text-sm text-zinc-500" : "flex h-56 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500"}>
                                            No image attached
                                        </div>
                                    )}
                                </div>
                            </div>

                            {request.status === "REVIEWED" && request.designPreviewUrl ? (
                                <div className="mt-6 space-y-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-500/30 dark:bg-cyan-500/10">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-500">Design Ready</p>
                                        <p className={isDark ? "mt-2 text-sm text-zinc-200" : "mt-2 text-sm text-cyan-900"}>
                                            Admin has shared the designed T-shirt preview. Confirm it to move into payment and delivery, or cancel if it is not what you want.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button type="button" disabled={decisionLoading} onClick={() => handleConfirmDesign(request.orderId)} className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60">
                                            {decisionLoading ? "Confirming..." : "Confirm Order"}
                                        </button>
                                        <button type="button" disabled={decisionLoading} onClick={() => handleCancelDesign(request.orderId)} className={isDark ? "rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60" : "rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"}>
                                            {decisionLoading ? "Canceling..." : "Cancel Order"}
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                            {request.status === "APPROVED" || request.customerDecision === "CONFIRMED" ? (
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button type="button" onClick={() => handleCheckout(request.orderId, Boolean(request.convertedToCart))} className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
                                        Proceed to Checkout
                                    </button>
                                    <p className={isDark ? "self-center text-sm text-zinc-400" : "self-center text-sm text-zinc-600"}>
                                        Approved requests can be converted into a normal cart item for payment.
                                    </p>
                                </div>
                            ) : null}

                            {request.status === "REJECTED" ? (
                                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
                                    <p className="font-semibold">Rejected by admin</p>
                                    <p className="mt-2">{request.adminResponse || "The requested design could not be created. Please submit a revised request if needed."}</p>
                                </div>
                            ) : null}

                            {request.status === "CANCELED" ? (
                                <div className={isDark ? "mt-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-sm text-zinc-200" : "mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700"}>
                                    This request was canceled by the customer.
                                </div>
                            ) : null}
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default CustomEditionTracking;
