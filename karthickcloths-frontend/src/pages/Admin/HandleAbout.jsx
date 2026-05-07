import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAboutContent, updateAboutContent, syncAboutContentFromServer } from "../../services/aboutStore";

function HandleAbout({ isDark }) {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [formData, setFormData] = useState(getAboutContent());
    const [message, setMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        if (!(user?.admin || user?.isAdmin)) {
            navigate("/", { replace: true });
        }
    }, [navigate, user?.admin, user?.isAdmin]);

    useEffect(() => {
        const loadContent = async () => {
            await syncAboutContentFromServer(true);
            setFormData(getAboutContent());
        };
        loadContent();

        const handleContentChange = () => {
            setFormData(getAboutContent());
        };

        window.addEventListener("kc-about-changed", handleContentChange);
        return () => window.removeEventListener("kc-about-changed", handleContentChange);
    }, []);

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleValueChange = (index, field, value) => {
        setFormData((prev) => {
            const newValues = [...prev.values];
            newValues[index] = { ...newValues[index], [field]: value };
            return { ...prev, values: newValues };
        });
    };

    const addValue = () => {
        setFormData((prev) => ({
            ...prev,
            values: [...prev.values, { title: "New Value", description: "Add description", icon: "✨" }]
        }));
    };

    const removeValue = (index) => {
        setFormData((prev) => ({
            ...prev,
            values: prev.values.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        if (!token) {
            setMessage({ type: "error", text: "Not authenticated" });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            await updateAboutContent(formData, token);
            setMessage({ type: "success", text: "About content updated successfully!" });
            window.alert("About content saved successfully.");
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Failed to update content" });
            window.alert(error.message || "Failed to save About content.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = async () => {
        await syncAboutContentFromServer(true);
        setFormData(getAboutContent());
        setMessage({ type: "info", text: "Content reloaded from server" });
        setTimeout(() => setMessage(null), 2000);
    };

    return (
        <div className={isDark ? "min-h-screen bg-black text-white" : "min-h-screen bg-white text-black"}>
            <div className="py-8 px-4 md:px-20">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Edit About Us</h1>
                        <p className={isDark ? "text-gray-400" : "text-gray-600"}>Customize the About Us page content</p>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${message.type === "success"
                            ? isDark ? "bg-green-900 text-green-100" : "bg-green-100 text-green-800"
                            : message.type === "error"
                                ? isDark ? "bg-red-900 text-red-100" : "bg-red-100 text-red-800"
                                : isDark ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div ref={editorRef} className={`space-y-8 ${isDark ? "bg-zinc-900" : "bg-gray-50"} p-8 rounded-lg`}>
                        {/* Basic Info */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Basic Information</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Page Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFieldChange}
                                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Hero Image URL</label>
                                <input
                                    type="text"
                                    name="heroImage"
                                    value={formData.heroImage}
                                    onChange={handleFieldChange}
                                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-bold">Preview</label>
                                <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-zinc-700 bg-black" : "border-gray-200 bg-white"}`}>
                                    {formData.heroImage ? (
                                        <img
                                            src={formData.heroImage}
                                            alt="About page preview"
                                            className="h-64 w-full object-cover"
                                            onError={(event) => {
                                                event.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <div className={`flex h-64 items-center justify-center px-6 text-center text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                                            Add a hero image URL to see the preview here.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Story */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                            <textarea
                                name="story"
                                value={formData.story}
                                onChange={handleFieldChange}
                                rows={6}
                                className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                        </div>

                        {/* Mission */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Mission</h2>
                            <input
                                type="text"
                                name="missionTitle"
                                value={formData.missionTitle}
                                onChange={handleFieldChange}
                                className={`w-full px-4 py-2 rounded-lg border transition-colors mb-4 ${isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <textarea
                                name="missionDescription"
                                value={formData.missionDescription}
                                onChange={handleFieldChange}
                                rows={4}
                                className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                        </div>

                        {/* Vision */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Vision</h2>
                            <input
                                type="text"
                                name="visionTitle"
                                value={formData.visionTitle}
                                onChange={handleFieldChange}
                                className={`w-full px-4 py-2 rounded-lg border transition-colors mb-4 ${isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <textarea
                                name="visionDescription"
                                value={formData.visionDescription}
                                onChange={handleFieldChange}
                                rows={4}
                                className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                        </div>

                        {/* Core Values */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Core Values</h2>
                                <button
                                    onClick={addValue}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    + Add Value
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.values.map((value, index) => (
                                    <div key={index} className={`p-4 rounded-lg border ${isDark ? "border-zinc-700 bg-black" : "border-gray-200 bg-white"}`}>
                                        <div className="flex justify-between mb-3">
                                            <h3 className="font-bold">Value {index + 1}</h3>
                                            <button
                                                onClick={() => removeValue(index)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="mb-3">
                                            <label className="block text-sm font-bold mb-2">Icon (emoji)</label>
                                            <input
                                                type="text"
                                                value={value.icon}
                                                onChange={(e) => handleValueChange(index, "icon", e.target.value)}
                                                maxLength="2"
                                                className={`w-16 px-2 py-1 rounded border text-center transition-colors ${isDark ? "bg-zinc-800 border-zinc-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="block text-sm font-bold mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={value.title}
                                                onChange={(e) => handleValueChange(index, "title", e.target.value)}
                                                className={`w-full px-3 py-2 rounded border transition-colors ${isDark ? "bg-zinc-800 border-zinc-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">Description</label>
                                            <textarea
                                                value={value.description}
                                                onChange={(e) => handleValueChange(index, "description", e.target.value)}
                                                rows={3}
                                                className={`w-full px-3 py-2 rounded border transition-colors ${isDark ? "bg-zinc-800 border-zinc-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Team */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Team Section</h2>
                            <input
                                type="text"
                                name="teamTitle"
                                value={formData.teamTitle}
                                onChange={handleFieldChange}
                                className={`w-full px-4 py-2 rounded-lg border transition-colors mb-4 ${isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <textarea
                                name="teamDescription"
                                value={formData.teamDescription}
                                onChange={handleFieldChange}
                                rows={3}
                                className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${isSaving ? "opacity-50 cursor-not-allowed" : ""} ${isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={handleReset}
                                className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${isDark ? "bg-zinc-700 hover:bg-zinc-600 text-white" : "bg-gray-300 hover:bg-gray-400 text-black"}`}
                            >
                                Reload from Server
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HandleAbout;
