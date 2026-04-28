import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { catalogCategoryMeta, deleteCatalogProduct, getCatalogProducts, getNextCatalogProductId, upsertCatalogProduct } from "../../services/catalogStore";
import { useAuth } from "../../context/AuthContext";

const defaultFormState = (category = "men") => ({
    id: "",
    category,
    name: "",
    brand: "",
    description: "",
    originalPrice: "",
    offerPrice: "",
    discountPercent: "",
    defaultColor: "",
    availableColors: "",
    sizes: "",
    fabric: "",
    fit: "",
    collar: "",
    sleeve: "",
    seller: "",
    deliveryBy: "",
    sellerRating: "",
    ratingText: "",
    availability: "In stock",
    images: ["", "", "", "", ""],
});

const categoryOrder = ["men", "women", "kids", "constitutional"];

function AdminDashboard({ isDark }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState("men");
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [formData, setFormData] = useState(defaultFormState("men"));
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!(user?.admin || user?.isAdmin)) {
            navigate("/", { replace: true });
        }
    }, [navigate, user?.admin, user?.isAdmin]);

    useEffect(() => {
        const syncProducts = () => {
            setProducts(getCatalogProducts(selectedCategory));
        };

        syncProducts();

        window.addEventListener("kc-catalog-changed", syncProducts);
        return () => window.removeEventListener("kc-catalog-changed", syncProducts);
    }, [selectedCategory]);

    useEffect(() => {
        if (editingProductId) {
            const product = products.find((item) => Number(item.id) === Number(editingProductId));
            if (product) {
                setFormData({
                    id: product.id,
                    category: product.category,
                    name: product.name || "",
                    brand: product.brand || "",
                    description: product.description || "",
                    originalPrice: String(product.originalPrice ?? ""),
                    offerPrice: String(product.offerPrice ?? ""),
                    discountPercent: String(product.discountPercent ?? ""),
                    defaultColor: product.defaultColor || "",
                    availableColors: (product.availableColors || []).join(", "),
                    sizes: (product.sizes || []).join(", "),
                    fabric: product.fabric || "",
                    fit: product.fit || "",
                    collar: product.collar || "",
                    sleeve: product.sleeve || "",
                    seller: product.seller || "",
                    deliveryBy: product.deliveryBy || "",
                    sellerRating: String(product.sellerRating ?? ""),
                    ratingText: product.ratingText || "",
                    availability: product.availability || "In stock",
                    images: [...(product.images || []), "", "", "", ""].slice(0, 5),
                });
            }
        }
    }, [editingProductId, products]);

    const categoryLabel = catalogCategoryMeta[selectedCategory]?.label || "Products";

    const visibleProducts = useMemo(() => products, [products]);

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleImageChange = (index, value) => {
        setFormData((previous) => {
            const nextImages = [...previous.images];
            nextImages[index] = value;
            return { ...previous, images: nextImages };
        });
    };

    const startCreate = () => {
        setEditingProductId(null);
        setFormData(defaultFormState(selectedCategory));
        setMessage(null);
    };

    const startEdit = (product) => {
        setSelectedCategory(product.category);
        setEditingProductId(product.id);
    };

    const handleDelete = (productId) => {
        deleteCatalogProduct(selectedCategory, productId);
        setMessage("Product deleted successfully.");
        if (Number(editingProductId) === Number(productId)) {
            startCreate();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const images = formData.images.filter((image) => image.trim());
        const productPayload = {
            ...formData,
            id: editingProductId || getNextCatalogProductId(selectedCategory),
            category: selectedCategory,
            originalPrice: Number(formData.originalPrice),
            offerPrice: Number(formData.offerPrice),
            discountPercent: Number(formData.discountPercent),
            sellerRating: Number(formData.sellerRating),
            availableColors: formData.availableColors,
            sizes: formData.sizes,
            images,
        };

        if (!productPayload.name || !productPayload.brand || !images[0]) {
            const validationMessage = "Please enter the product name, brand, and at least one image.";
            setMessage(validationMessage);
            window.alert(validationMessage);
            return;
        }

        upsertCatalogProduct(selectedCategory, productPayload);
        setEditingProductId(null);
        setFormData(defaultFormState(selectedCategory));
        const successMessage = "Product saved successfully.";
        setMessage(successMessage);
        window.alert(successMessage);
    };

    return (
        <main className={isDark ? "min-h-screen bg-zinc-950 px-4 pb-12 pt-28 text-zinc-100" : "min-h-screen bg-zinc-50 px-4 pb-12 pt-28 text-zinc-900"}>
            <section className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className={isDark ? "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400" : "text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600"}>
                            Admin workspace
                        </p>
                        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Catalog Manager</h1>
                        <p className={isDark ? "mt-3 max-w-2xl text-sm leading-7 text-zinc-300" : "mt-3 max-w-2xl text-sm leading-7 text-zinc-600"}>
                            Add, edit, or remove products for men, women, kids, and constitutional tees collections without changing the site layout.
                        </p>
                    </div>
                    <div className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300" : "rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"}>
                        Signed in as <span className="font-semibold">{user?.fullName}</span>
                    </div>
                </div>

                {message ? (
                    <div className={isDark ? "mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200" : "mb-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"}>
                        {message}
                    </div>
                ) : null}

                <div className="mb-6 flex flex-wrap gap-3">
                    {categoryOrder.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => {
                                setSelectedCategory(category);
                                setEditingProductId(null);
                                setFormData(defaultFormState(category));
                            }}
                            className={selectedCategory === category
                                ? "rounded-full bg-black px-5 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
                                : isDark
                                    ? "rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-300"
                                    : "rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700"}
                        >
                            {catalogCategoryMeta[category].label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={startCreate}
                        className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
                    >
                        New Product
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className={isDark ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20" : "rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60"}>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Product form</p>
                                <h2 className="mt-2 text-2xl font-semibold">{editingProductId ? "Edit Product" : `Add to ${categoryLabel}`}</h2>
                            </div>
                            {editingProductId ? (
                                <button type="button" onClick={startCreate} className="rounded-full border border-zinc-400 px-4 py-2 text-xs font-semibold">
                                    Cancel Edit
                                </button>
                            ) : null}
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Product Name</span>
                                <input name="name" value={formData.name} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Brand</span>
                                <input name="brand" value={formData.brand} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Category</span>
                                <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none">
                                    {categoryOrder.map((category) => (
                                        <option key={category} value={category}>
                                            {catalogCategoryMeta[category].label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Description</span>
                                <textarea name="description" value={formData.description} onChange={handleFieldChange} rows="3" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Original Price</span>
                                <input name="originalPrice" type="number" value={formData.originalPrice} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Offer Price</span>
                                <input name="offerPrice" type="number" value={formData.offerPrice} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Discount Percent</span>
                                <input name="discountPercent" type="number" value={formData.discountPercent} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Default Color</span>
                                <input name="defaultColor" value={formData.defaultColor} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Available Colors</span>
                                <input name="availableColors" value={formData.availableColors} onChange={handleFieldChange} placeholder="Comma separated" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Sizes</span>
                                <input name="sizes" value={formData.sizes} onChange={handleFieldChange} placeholder="Comma separated" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Fabric</span>
                                <input name="fabric" value={formData.fabric} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Fit</span>
                                <input name="fit" value={formData.fit} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Collar</span>
                                <input name="collar" value={formData.collar} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Sleeve</span>
                                <input name="sleeve" value={formData.sleeve} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Seller</span>
                                <input name="seller" value={formData.seller} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Delivery By</span>
                                <input name="deliveryBy" value={formData.deliveryBy} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Seller Rating</span>
                                <input name="sellerRating" type="number" step="0.1" value={formData.sellerRating} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Rating Text</span>
                                <input name="ratingText" value={formData.ratingText} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" />
                            </label>
                            <label className="space-y-2 text-sm md:col-span-2">
                                <span className="font-medium">Availability</span>
                                <select name="availability" value={formData.availability} onChange={handleFieldChange} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none">
                                    <option>In stock</option>
                                    <option>Limited stock</option>
                                    <option>Out of stock</option>
                                </select>
                            </label>

                            <div className="md:col-span-2">
                                <p className="text-sm font-medium">Images</p>
                                <div className="mt-3 grid gap-3 md:grid-cols-2">
                                    {formData.images.map((image, index) => (
                                        <label key={index} className="space-y-2 text-sm">
                                            <span>{index === 0 ? "Main Image" : `Extra Image ${index}`}</span>
                                            <input value={image} onChange={(event) => handleImageChange(index, event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 outline-none" placeholder="Paste image URL" />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                                <button type="submit" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-black">
                                    {editingProductId ? "Update Product" : "Add Product"}
                                </button>
                                <button type="button" onClick={startCreate} className={isDark ? "rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700"}>
                                    Reset Form
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className={isDark ? "rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20" : "rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60"}>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Saved products</p>
                                <h2 className="mt-2 text-2xl font-semibold">{categoryLabel}</h2>
                            </div>
                            <span className={isDark ? "rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300" : "rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700"}>
                                {visibleProducts.length}
                            </span>
                        </div>

                        <div className="mt-5 space-y-4">
                            {visibleProducts.map((product) => (
                                <div key={`${product.category}-${product.id}`} className={isDark ? "rounded-2xl border border-zinc-800 bg-zinc-950 p-4" : "rounded-2xl border border-zinc-200 bg-zinc-50 p-4"}>
                                    <div className="flex gap-4">
                                        <img src={product.images?.[0]} alt={product.name} className="h-24 w-20 rounded-xl object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{product.brand}</p>
                                            <h3 className="mt-1 line-clamp-2 text-sm font-semibold">{product.name}</h3>
                                            <p className="mt-2 text-sm font-medium">₹{product.offerPrice}</p>
                                            <p className={isDark ? "mt-1 text-xs text-zinc-400" : "mt-1 text-xs text-zinc-600"}>{product.availability || "In stock"}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button type="button" onClick={() => startEdit(product)} className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-white">
                                            Edit
                                        </button>
                                        <button type="button" onClick={() => handleDelete(product.id)} className="rounded-full border border-red-400 px-4 py-2 text-xs font-semibold text-red-500">
                                            Delete
                                        </button>
                                        <button type="button" onClick={() => navigate(product.route)} className={isDark ? "rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200" : "rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700"}>
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                <section className={isDark ? "mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20" : "mt-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60"}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Custom Edition Desk</p>
                            <h2 className="mt-2 text-2xl font-semibold">Dedicated order management</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/custom-edition")}
                            className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white"
                        >
                            Open Custom Orders
                        </button>
                    </div>
                    <p className={isDark ? "mt-4 text-sm text-zinc-400" : "mt-4 text-sm text-zinc-600"}>
                        Custom edition requests now live in a separate admin page so the main catalog dashboard stays focused on products.
                    </p>
                </section>

                <section className={isDark ? "mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20" : "mt-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60"}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Footer controls</p>
                            <h2 className="mt-2 text-2xl font-semibold">Handle Footer</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/handle-footer")}
                            className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white"
                        >
                            Edit Contact, Location, Tagline
                        </button>
                    </div>
                    <p className={isDark ? "mt-4 text-sm text-zinc-400" : "mt-4 text-sm text-zinc-600"}>
                        Update the footer tagline, GSTIN, locations, and contact details without touching the main layout.
                    </p>
                </section>

                <section className={isDark ? "mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20" : "mt-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60"}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Home controls</p>
                            <h2 className="mt-2 text-2xl font-semibold">Handle Home</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/handle-home")}
                            className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white"
                        >
                            Edit Featured Cards & Curated Looks
                        </button>
                    </div>
                    <p className={isDark ? "mt-4 text-sm text-zinc-400" : "mt-4 text-sm text-zinc-600"}>
                        Manage the two featured cards and the five curated looks shown on the home page.
                    </p>
                </section>
            </section>
        </main>
    );
}

export default AdminDashboard;