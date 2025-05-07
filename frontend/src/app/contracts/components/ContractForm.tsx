import React, { useState, useEffect } from "react";
import { X, Plus, RefreshCw, AlertTriangle, CheckCircle, Info, HelpCircle } from "lucide-react";

const InfoRow = ({ label, value, isUrl = false }) => (
    <div className="text-zinc-300">
        <strong>{label}:</strong>{" "}
        <span className={`inline-block ${isUrl ? "truncate max-w-[90%] align-bottom" : ""}`}>
            {value || "-"}
        </span>
    </div>
);

const ContractForm = ({
    isEdit = false,
    formData,
    setFormData,
    onSubmit,
    submitting,
    onClose
}) => {
    // Use local state for form inputs to prevent losing focus
    const [localFormData, setLocalFormData] = useState({
        name: formData.name || "",
        description: formData.description || "",
        upload_type: formData.upload_type || "github",
        upload_url: formData.upload_url || ""
    });

    // State for validation
    const [errors, setErrors] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);

    // Update local form data when props change
    useEffect(() => {
        setLocalFormData({
            name: formData.name || "",
            description: formData.description || "",
            upload_type: formData.upload_type || "github",
            upload_url: formData.upload_url || ""
        });
    }, [formData]);

    // Validate form fields
    const validateForm = () => {
        const newErrors = {};

        // Validate name
        if (!localFormData.name.trim()) {
            newErrors.name = "Contract name is required";
        }

        // Validate URL based on upload type
        if (!validateUploadURL(localFormData.upload_type, localFormData.upload_url)) {
            newErrors.upload_url = "Invalid URL for the selected upload type";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // URL validation function
    const validateUploadURL = (uploadType, url) => {
        url = url.trim();
        if (url === "") {
            return false;
        }

        switch (uploadType) {
            case "github":
                return url.startsWith("https://github.com/");
            case "google_drive":
                return url.startsWith("https://drive.google.com/") ||
                    url.startsWith("https://docs.google.com/");
            case "gitlab":
                return url.startsWith("https://gitlab.com/");
            case "bitbucket":
                return url.startsWith("https://bitbucket.org/");
            case "ipfs":
                return url.startsWith("ipfs://") ||
                    url.startsWith("https://ipfs.io/ipfs/");
            case "program_id":
                return url.length >= 32 && url.length <= 44;
            default:
                return false;
        }
    };

    // Handle form submit with validation
    const handleSubmit = () => {
        setFormData({ ...localFormData });
        if (validateForm()) {
            setShowConfirmation(true);
        }
    };

    const confirmSubmit = () => {

        setShowConfirmation(false);

        // Use setTimeout to ensure state update completes before submission
        setTimeout(() => {
            onSubmit();
        }, 0);
    };

    // Get the appropriate placeholder based on upload type
    const getPlaceholder = () => {
        switch (localFormData.upload_type) {
            case "github":
                return "https://github.com/username/repo";
            case "program_id":
                return "Enter Contract Address (32-44 characters)";
            case "google_drive":
                return "https://drive.google.com/file/d/...";
            case "gitlab":
                return "https://gitlab.com/username/repo";
            case "bitbucket":
                return "https://bitbucket.org/username/repo";
            case "ipfs":
                return "ipfs://... or https://ipfs.io/ipfs/...";
            default:
                return "Enter URL";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg animate-scaleIn">
                {/* Header with title and close button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">
                        {isEdit ? "Update Contract" : "Create New Contract"}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                            title="Toggle instructions"
                        >
                            <HelpCircle size={20} className="text-zinc-400 hover:text-white" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                            title="Close form"
                        >
                            <X size={20} className="text-zinc-400 hover:text-white" />
                        </button>
                    </div>
                </div>

                {/* Important notice */}
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-6 flex items-start gap-3 animate-pulse">
                    <AlertTriangle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-red-200">
                        <strong>Important:</strong> Do not close this form. You will not be able to create an audit
                        in the same payment session if you close it.
                    </p>
                </div>

                {/* Collapsible instructions */}
                {showInstructions && (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6 animate-slideDown">
                        <h3 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
                            <Info size={18} className="text-blue-400" />
                            Instructions
                        </h3>
                        <ul className="text-sm text-zinc-300 space-y-2 pl-6 list-disc">
                            <li><strong>Contract Name:</strong> Provide a unique and meaningful name to easily identify your contract.</li>
                            <li><strong>Description:</strong> Explain your smart contract details and include any instructions needed to work with your project.</li>
                            <li><strong>Upload Type:</strong> You can only upload URLs, ZIP files of your code, or the contract address.</li>
                            <li><strong>URL:</strong> Make sure to verify your URL matches the upload type you've selected.</li>
                        </ul>
                    </div>
                )}

                <div className="space-y-5">
                    {/* Contract Name Field */}
                    <div className="">
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                            Contract Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={localFormData.name}
                            onChange={(e) => {
                                setLocalFormData({ ...localFormData, name: e.target.value });
                                if (errors.name) {
                                    setErrors({ ...errors, name: null });
                                }
                            }}
                            className={`w-full bg-zinc-800 border ${errors.name ? 'border-red-500' : 'border-zinc-700'} rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                            placeholder="e.g., MyDeFiStaking_v1"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-400 animate-shake">{errors.name}</p>
                        )}
                        <p className="mt-1 text-xs text-zinc-400">
                            Choose a unique and descriptive name that helps you identify this contract later.
                        </p>
                    </div>

                    {/* Description Field */}
                    <div className="">
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            value={localFormData.description}
                            onChange={(e) => setLocalFormData({ ...localFormData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="e.g., This is a DeFi staking contract that allows users to stake ERC-20 tokens for rewards. Special instructions: use Hardhat for testing."
                        />
                        <p className="mt-1 text-xs text-zinc-400">
                            Provide details about your contract functionality and any special instructions for auditors.
                        </p>
                    </div>

                    {/* Upload Type Field */}
                    <div className="">
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                            Upload Type <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={localFormData.upload_type}
                            onChange={(e) => {
                                setLocalFormData({ ...localFormData, upload_type: e.target.value, upload_url: "" });
                                if (errors.upload_url) {
                                    setErrors({ ...errors, upload_url: null });
                                }
                            }}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        >
                            <option value="github">GitHub Repository</option>
                            <option value="program_id">Contract Address</option>
                            <option value="google_drive">Google Drive</option>
                            <option value="gitlab">GitLab Repository</option>
                            <option value="bitbucket">Bitbucket Repository</option>
                            <option value="ipfs">IPFS</option>
                        </select>
                        <p className="mt-1 text-xs text-zinc-400">
                            Select where your contract code or address is stored.
                        </p>
                    </div>

                    {/* URL Field */}
                    <div className="">
                        <label className="block text-zinc-300 text-sm font-medium mb-2">
                            URL / Contract Address <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={localFormData.upload_url}
                            onChange={(e) => {
                                setLocalFormData({ ...localFormData, upload_url: e.target.value });
                                if (errors.upload_url) {
                                    setErrors({ ...errors, upload_url: null });
                                }
                            }}
                            className={`w-full bg-zinc-800 border ${errors.upload_url ? 'border-red-500' : 'border-zinc-700'} rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                            placeholder={getPlaceholder()}
                        />
                        {errors.upload_url ? (
                            <p className="mt-1 text-xs text-red-400 animate-shake">{errors.upload_url}</p>
                        ) : (
                            <p className="mt-1 text-xs text-zinc-400">
                                {localFormData.upload_type === "github" && "Must be a valid GitHub repository URL starting with https://github.com/"}
                                {localFormData.upload_type === "program_id" && "Must be 32-44 characters long"}
                                {localFormData.upload_type === "google_drive" && "Must be a valid Google Drive URL starting with https://drive.google.com/ or https://docs.google.com/"}
                                {localFormData.upload_type === "gitlab" && "Must be a valid GitLab repository URL starting with https://gitlab.com/"}
                                {localFormData.upload_type === "bitbucket" && "Must be a valid Bitbucket repository URL starting with https://bitbucket.org/"}
                                {localFormData.upload_type === "ipfs" && "Must be a valid IPFS URL starting with ipfs:// or https://ipfs.io/ipfs/"}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:bg-zinc-600 disabled:text-zinc-400 transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="h-5 w-5 rounded-full border-2 border-zinc-500 border-t-white animate-spin"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    {isEdit ? (
                                        <>
                                            <RefreshCw size={18} />
                                            <span>Update Contract</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            <span>Create Contract</span>
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {showConfirmation && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-xl animate-scaleIn">
                            <div className="text-center mb-5">
                                <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                                <h3 className="text-2xl font-semibold text-white">Confirm Submission</h3>
                                <p className="text-sm text-zinc-400 mt-1">
                                    Are you sure you want to {isEdit ? "update" : "create"} this contract?
                                </p>
                            </div>

                            <div className="bg-zinc-800 p-4 rounded-xl space-y-2 mb-6 text-sm">
                                <InfoRow label="Name" value={localFormData.name} />
                                <InfoRow label="Type" value={localFormData.upload_type} />
                                <InfoRow label="URL" value={localFormData.upload_url} isUrl />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmSubmit}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ContractForm;
