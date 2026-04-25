import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchAdminCustomEditionRequests, respondToCustomEditionRequest } from "../../services/api";

const statusFilters = ["ALL", "PENDING", "REVIEWED", "APPROVED", "REJECTED", "CANCELED"];

function CustomEditionOrders({ isDark }) {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [drafts, setDrafts] = useState({});

    useEffect(() => {
        if (!(user?.admin || user?.isAdmin)) {
            navigate("/", { replace: true });
        }
    }, [navigate, user?.admin, user?.isAdmin]);

    const loadRequests = async (filter = statusFilter) => {
        if (!token) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetchAdminCustomEditionRequests(token, filter === "ALL" ? "" : filter);
            setRequests(Array.isArray(response) ? response : []);
        } catch (error) {
            setMessage(error.message || "Unable to load custom orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests(statusFilter);
    }, [token, statusFilter]);

    const visibleRequests = useMemo(() => requests, [requests]);

    const handleDraftChange = (requestId, field, value) => {
        setDrafts((previous) => ({
            ...previous,
            [requestId]: {
                ...(previous[requestId] || {}),
                [field]: value,
            },
        }));
    };

    const handleSave = async (requestId, nextStatus) => {
        const draft = drafts[requestId] || {};
        const payload = {
            adminResponse: draft.adminResponse || "",
            status: nextStatus,
            price: draft.price === "" || draft.price == null ? 0 : Number(draft.price),
            designPreviewUrl: draft.designPreviewUrl || "",
        };

        if (!payload.adminResponse.trim()) {
            setMessage("Please enter an admin response before updating the request.");
            return;
        }

        if (nextStatus !== "REJECTED" && !payload.designPreviewUrl.trim()) {
            setMessage("Please share a design preview URL before marking this request as reviewed.");
            return;
        }

        try {
            await respondToCustomEditionRequest(requestId, payload, token);
            setMessage("Custom order updated successfully.");
            await loadRequests(statusFilter);
        } catch (error) {
            setMessage(error.message || "Unable to update custom order");
        }
    };

    return (
        <main className={isDark ? "min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100" : "min-h-screen bg-zinc-50 px-4 py-12 text-zinc-900"}>
            <section className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-500">Admin Custom Orders</p>
                        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Custom Edition Desk</h1>
                        <p className={isDark ? "mt-3 max-w-2xl text-sm leading-7 text-zinc-300" : "mt-3 max-w-2xl text-sm leading-7 text-zinc-600"}>
                            Review every custom request, inspect uploaded images, update the status, add a response, and assign a price.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/admin" className={isDark ? "rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700"}>
                            Back to Catalog Admin
                        </Link>
                        <button type="button" onClick={() => loadRequests(statusFilter)} className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-white">
                            Refresh
                        </button>
                    </div>
                </div>

                {message ? (
                    <div className={isDark ? "mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200" : "mt-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"}>
                        {message}
                    </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setStatusFilter(filter)}
                            className={statusFilter === filter
                                ? "rounded-full bg-black px-5 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
                                : isDark
                                    ? "rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-300"
                                    : "rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700"}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {loading ? <p className="mt-6 text-sm">Loading custom orders...</p> : null}

                <div className="mt-6 grid gap-5">
                    {visibleRequests.map((request) => {
                        const normalizedStatus = (request.status || "").toUpperCase();
                        const actionLocked = ["REVIEWED", "REJECTED", "APPROVED", "CANCELED"].includes(normalizedStatus);
                        const draft = drafts[request.id] || {
                            adminResponse: request.adminResponse || "",
                            price: request.price ?? 0,
                            designPreviewUrl: request.designPreviewUrl || "",
                        };

                        return (
                            <article key={request.id} className={isDark ? "rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6" : "rounded-[2rem] border border-zinc-200 bg-white p-6"}>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{request.orderId}</p>
                                        <h2 className="mt-2 text-2xl font-semibold">{request.fullName}</h2>
                                        <p className={isDark ? "mt-1 text-sm text-zinc-400" : "mt-1 text-sm text-zinc-600"}>
                                            {request.userEmail} {request.contactEmail ? `| Contact ${request.contactEmail}` : ""}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                        <span className={isDark ? "rounded-full border border-zinc-700 px-3 py-1 text-zinc-300" : "rounded-full border border-zinc-300 px-3 py-1 text-zinc-700"}>{request.status}</span>
                                        {normalizedStatus === "REVIEWED" ? (
                                            <span className="rounded-full border border-cyan-300 bg-cyan-100 px-3 py-1 text-cyan-800">Preview Shared</span>
                                        ) : null}
                                        {normalizedStatus === "REJECTED" ? (
                                            <span className="rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-rose-800">Rejected</span>
                                        ) : null}
                                        {normalizedStatus === "APPROVED" ? (
                                            <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-emerald-800">Approved</span>
                                        ) : null}
                                        {normalizedStatus === "CANCELED" ? (
                                            <span className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-zinc-700">Canceled</span>
                                        ) : null}
                                        {request.convertedToCart ? (
                                            <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-emerald-800">Converted</span>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
                                    <div className="space-y-3 text-sm">
                                        <p><span className="font-semibold">T-Shirt:</span> {request.tshirtType}</p>
                                        <p><span className="font-semibold">Color:</span> {request.colorPreference || "-"}</p>
                                        <p><span className="font-semibold">Size:</span> {request.sizePreference || "-"}</p>
                                        <p><span className="font-semibold">Quantity:</span> {request.quantity}</p>
                                        <p><span className="font-semibold">Phone:</span> {request.phoneNumber || "-"}</p>
                                        <p><span className="font-semibold">Design:</span> {request.designIdea}</p>
                                        <p><span className="font-semibold">Design Preview:</span> {request.designPreviewUrl ? "Shared with customer" : "Not shared yet"}</p>
                                        <p><span className="font-semibold">Price:</span> {typeof request.price === "number" ? `₹${request.price}` : "Not set"}</p>
                                        <p><span className="font-semibold">Admin response:</span> {request.adminResponse || "-"}</p>
                                    </div>
                                    <div>
                                        {request.designPreviewUrl ? (
                                            <img src={request.designPreviewUrl} alt={request.orderId} className="h-64 w-full rounded-2xl object-cover" />
                                        ) : request.imageUrl ? (
                                            <img src={request.imageUrl} alt={request.orderId} className="h-64 w-full rounded-2xl object-cover" />
                                        ) : (
                                            <div className={isDark ? "flex h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 text-sm text-zinc-500" : "flex h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500"}>
                                                No image uploaded
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    <label className="space-y-2 text-sm">
                                        <span className="font-medium">Price</span>
                                        <input type="number" min="0" disabled={actionLocked} value={draft.price} onChange={(event) => handleDraftChange(request.id, "price", event.target.value)} className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700" />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="font-medium">Design Preview URL</span>
                                        <input type="url" disabled={actionLocked} value={draft.designPreviewUrl} onChange={(event) => handleDraftChange(request.id, "designPreviewUrl", event.target.value)} className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700" placeholder="https://..." />
                                    </label>
                                </div>

                                <label className="mt-4 block space-y-2 text-sm">
                                    <span className="font-medium">Admin Response</span>
                                    <textarea rows="4" disabled={actionLocked} value={draft.adminResponse} onChange={(event) => handleDraftChange(request.id, "adminResponse", event.target.value)} className="w-full rounded-2xl border border-zinc-300 bg-transparent px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700" placeholder="Tell the customer about design changes, production notes, or next steps." />
                                </label>

                                {!actionLocked ? (
                                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                                        <button type="button" onClick={() => handleSave(request.id, "REVIEWED")} className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">
                                            Share Preview & Mark Reviewed
                                        </button>
                                        <button type="button" onClick={() => handleSave(request.id, "REJECTED")} className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600">
                                            Reject Request
                                        </button>
                                    </div>
                                ) : (
                                    <div className={isDark ? "mt-5 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-300" : "mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"}>
                                        {normalizedStatus === "REVIEWED" ? "Preview already shared with customer. Actions are locked for this request." : null}
                                        {normalizedStatus === "REJECTED" ? "Request already rejected. Actions are locked for this request." : null}
                                        {normalizedStatus === "APPROVED" ? "Customer confirmed the preview. This request is now in the Approved section." : null}
                                        {normalizedStatus === "CANCELED" ? "Customer canceled after preview. This request is now in the Canceled section." : null}
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

export default CustomEditionOrders;
