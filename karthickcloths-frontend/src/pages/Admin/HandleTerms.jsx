import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTermsContent, updateTermsContent, syncTermsContentFromServer } from "../../services/termsStore";

function HandleTerms({ isDark }) {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [formData, setFormData] = useState(getTermsContent());
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
            await syncTermsContentFromServer(true);
            setFormData(getTermsContent());
        };
        loadContent();

        const handleContentChange = () => {
            setFormData(getTermsContent());
        };

        window.addEventListener("kc-terms-changed", handleContentChange);
        return () => window.removeEventListener("kc-terms-changed", handleContentChange);
    }, []);

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSectionChange = (index, field, value) => {
        setFormData((prev) => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], [field]: value };
            return { ...prev, sections: newSections };
        });
    };

    const addSection = () => {
        const newId = `section-${Date.now()}`;
        setFormData((prev) => ({
            ...prev,
            sections: [
                ...prev.sections,
                {
                    id: newId,
                    title: `New Section ${prev.sections.length + 1}`,
                    content: "Add section content here"
                }
            ]
        }));
    };

    const removeSection = (index) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index)
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
            await updateTermsContent(formData, token);
            setMessage({ type: "success", text: "Terms & Conditions updated successfully!" });
            window.alert("Terms & Conditions saved successfully.");
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Failed to update content" });
            window.alert(error.message || "Failed to save Terms & Conditions.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = async () => {
        await syncTermsContentFromServer(true);
        setFormData(getTermsContent());
        setMessage({ type: "info", text: "Content reloaded from server" });
        setTimeout(() => setMessage(null), 2000);
    };

    return (
        <div className={isDark ? "min-h-screen bg-black text-white" : "min-h-screen bg-white text-black"}>
            <div className="py-8 px-4 md:px-20">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Edit Terms & Conditions</h1>
                        <p className={isDark ? "text-gray-400" : "text-gray-600"}>Manage your terms and conditions content</p>
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
                        {/* Header Info */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Page Information</h2>

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
                                <label className="block text-sm font-bold mb-2">Last Updated</label>
                                <input
                                    type="text"
                                    name="lastUpdated"
                                    value={formData.lastUpdated}
                                    onChange={handleFieldChange}
                                    placeholder="e.g., January 2024"
                                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark ? "bg-black border-zinc-700 text-white" : "bg-white border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                        </div>

                        {/* Sections */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Sections</h2>
                                <button
                                    onClick={addSection}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    + Add Section
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.sections.map((section, index) => (
                                    <div key={section.id} className={`p-6 rounded-lg border transition-all ${isDark ? "border-zinc-700 bg-black hover:bg-zinc-950" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
                                        <div className="flex justify-between mb-4">
                                            <h3 className="font-bold text-lg">Section {index + 1}</h3>
                                            <button
                                                onClick={() => removeSection(index)}
                                                className="text-red-500 hover:text-red-700 font-bold transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-bold mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                                                className={`w-full px-4 py-2 rounded border transition-colors ${isDark ? "bg-zinc-800 border-zinc-600 text-white" : "bg-gray-100 border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">Content</label>
                                            <textarea
                                                value={section.content}
                                                onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                                                rows={6}
                                                className={`w-full px-4 py-2 rounded border transition-colors ${isDark ? "bg-zinc-800 border-zinc-600 text-white" : "bg-gray-100 border-gray-300 text-black"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Enter section content. Use \n for line breaks."
                                            />
                                            <p className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                                                Tip: Use line breaks for better formatting
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
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

export default HandleTerms;
