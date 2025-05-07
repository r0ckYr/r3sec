import React, { useState, useEffect } from "react";
import { Check, Shield, Cpu, Star, RefreshCw, DollarSign } from "lucide-react";

const PricingPlans = ({ onSelectPlan }) => {
    const [solPrice, setSolPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fixed USD prices
    const plans = [
        {
            id: "standard",
            name: "Standard",
            price_usd: 50,
            icon: <Shield size={24} className="text-blue-400" />,
            features: [
                "Basic smart contract analysis",
                "Vulnerability assessment",
                "Report delivery in 5 business days",
                "1 revision included"
            ],
            recommended: false,
            color: "blue"
        },
        {
            id: "advanced",
            name: "Advanced",
            price_usd: 500,
            icon: <Cpu size={24} className="text-green-400" />,
            features: [
                "In-depth code analysis",
                "Comprehensive vulnerability assessment",
                "Formal verification",
                "Report delivery in 3 business days",
                "2 revisions included",
                "Direct consultation with auditors"
            ],
            recommended: true,
            color: "green"
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price_usd: 1000,
            icon: <Star size={24} className="text-purple-400" />,
            features: [
                "Full security audit",
                "Advanced vulnerability detection",
                "Gas optimization",
                "Business logic review",
                "Priority support",
                "Report delivery in 2 business days",
                "Unlimited revisions",
                "Dedicated security consultant"
            ],
            recommended: false,
            color: "purple"
        }
    ];

    // Fetch SOL/USD price
    const fetchSolPrice = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
            if (!response.ok) {
                throw new Error('Failed to fetch SOL price');
            }
            const data = await response.json();
            setSolPrice(data.solana.usd);
        } catch (err) {
            console.error('Error fetching SOL price:', err);
            setError('Could not load current SOL price');
            // Fallback price if API fails
            setSolPrice(100); // Default fallback value
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSolPrice();
    }, []);

    // Calculate SOL price based on USD amount
    const calculateSolPrice = (usdAmount) => {
        if (!solPrice || solPrice === 0) return null;
        const solAmount = usdAmount / solPrice;
        return solAmount.toFixed(4);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-white">Select an Audit Plan</h2>
                <p className="text-zinc-400 mt-2">
                    Choose the audit plan that best fits your security needs
                </p>
                <div className="mt-4 flex items-center justify-center">
                    {loading ? (
                        <p className="text-zinc-400 flex items-center">
                            <RefreshCw size={14} className="animate-spin mr-2" /> Loading SOL price...
                        </p>
                    ) : error ? (
                        <p className="text-amber-400 flex items-center">
                            <span className="mr-2">⚠️</span> {error}
                        </p>
                    ) : (
                        <p className="text-zinc-300">
                            Current SOL price: <span className="text-green-400 font-semibold">${solPrice}</span>
                            <button
                                onClick={fetchSolPrice}
                                className="ml-2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                                title="Refresh SOL price"
                            >
                                <RefreshCw size={14} />
                            </button>
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const solAmount = calculateSolPrice(plan.price_usd);
                    return (
                        <div
                            key={plan.id}
                            className={`relative border rounded-xl p-6 transition-all hover:scale-105 ${plan.recommended
                                ? `border-${plan.color}-500/40 bg-${plan.color}-900/10`
                                : "border-zinc-800 bg-zinc-900/50"
                                }`}
                        >
                            {plan.recommended && (
                                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 bg-${plan.color}-500 text-white text-xs px-3 py-1 rounded-full`}>
                                    Recommended
                                </div>
                            )}

                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        {plan.icon}
                                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                    </div>
                                    <div className="mt-4 mb-2">
                                        <div className="flex items-center">
                                            <DollarSign size={20} className="text-green-400" />
                                            <span className="text-2xl font-bold text-white">{plan.price_usd}</span>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <span className="text-md text-zinc-400">
                                            {solAmount ? `≈ ${solAmount} SOL` : 'Loading SOL price...'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <Check size={16} className={`mt-1 mr-2 text-${plan.color}-400`} />
                                        <span className="text-zinc-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => onSelectPlan({
                                    ...plan,
                                    price_sol: solAmount,  // Pass calculated SOL amount
                                    sol_price: solPrice    // Pass current SOL rate
                                })}
                                className={`w-full py-2 px-4 rounded-lg transition-colors ${plan.recommended
                                    ? `bg-${plan.color}-600 hover:bg-${plan.color}-500 text-white`
                                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                                    }`}
                            >
                                Select Plan
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PricingPlans;
