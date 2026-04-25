import { Link, useLocation, useParams } from "react-router-dom";

function CustomEditionSuccess({ isDark }) {
    const { orderId: routeOrderId } = useParams();
    const location = useLocation();
    const request = location.state?.request;
    const orderId = request?.orderId || routeOrderId;

    return (
        <main className={isDark ? "min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100" : "min-h-screen bg-zinc-50 px-4 py-16 text-zinc-900"}>
            <section className="mx-auto max-w-3xl">
                <div className={isDark ? "rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-black/30" : "rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-2xl shadow-zinc-200/70"}>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-500">Request Submitted</p>
                    <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Your custom order is in the queue.</h1>
                    <p className={isDark ? "mt-4 text-sm leading-7 text-zinc-300" : "mt-4 text-sm leading-7 text-zinc-600"}>
                        We have received your custom edition request. Use the order ID below to track updates anytime.
                    </p>

                    <div className={isDark ? "mt-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6" : "mt-8 rounded-2xl border border-cyan-200 bg-cyan-50 p-6"}>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-500">Order ID</p>
                        <p className="mt-2 text-3xl font-black tracking-[0.18em]">{orderId || "PENDING"}</p>
                        <p className={isDark ? "mt-3 text-sm text-cyan-100" : "mt-3 text-sm text-cyan-900"}>
                            Status starts as PENDING and will update after admin review.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to={`/custom-edition/track?orderId=${encodeURIComponent(orderId || "")}`} className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">
                            Track This Order
                        </Link>
                        <Link to="/custom-edition/track" className={isDark ? "rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700"}>
                            Track By Email
                        </Link>
                        <Link to="/custom-edition" className={isDark ? "rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700"}>
                            Submit Another Request
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default CustomEditionSuccess;
