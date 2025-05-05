"use client";

import React, { useState } from "react";
import { Shield, Zap, CheckCircle, AlertTriangle, Clock, Calendar, Activity, ChevronRight, BarChart2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PricingPage = () => {
    const [activeTab, setActiveTab] = useState("audit");

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold text-white">R3SEC Pricing</h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Enterprise-grade smart contract security solutions designed for projects of all sizes
                    </p>
                </div>

                {/* Pricing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-zinc-900 p-1 rounded-lg border border-zinc-800 inline-flex">
                        <button
                            onClick={() => setActiveTab("audit")}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "audit"
                                ? "bg-green-600 text-white"
                                : "bg-transparent text-zinc-400 hover:text-white"
                                }`}
                        >
                            One-Time Audits
                        </button>
                        <button
                            onClick={() => setActiveTab("subscription")}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "subscription"
                                ? "bg-green-600 text-white"
                                : "bg-transparent text-zinc-400 hover:text-white"
                                }`}
                        >
                            Early Access Plans
                        </button>
                    </div>
                </div>

                {/* One-Time Audit Plans */}
                {activeTab === "audit" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Standard Plan */}
                        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 transition-all hover:shadow-lg hover:shadow-zinc-900/30">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <Shield size={24} className="text-green-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Standard</h2>
                            </div>
                            <p className="text-zinc-400 text-sm mb-6">
                                For small programs (1–2 contracts, &lt;2K LOC)
                            </p>
                            <div className="mb-6">
                                <span className="text-white text-4xl font-bold">$50</span>
                                <span className="text-zinc-400 ml-2">one-time</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">PDF audit report</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Remediation checklist</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">1 follow-up review</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors font-medium" onClick={() => { window.location.href = '/auth/register' }}>
                                Get Started
                            </button>
                        </div>

                        {/* Advanced Plan */}
                        <div className="rounded-xl border border-green-800/30 bg-gradient-to-br from-zinc-900/90 to-zinc-950 p-6 transition-all hover:shadow-lg hover:shadow-green-900/20 relative">
                            <div className="absolute -top-3 right-6 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                POPULAR
                            </div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-green-900/30 rounded-lg">
                                    <BarChart2 size={24} className="text-green-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Advanced</h2>
                            </div>
                            <p className="text-zinc-400 text-sm mb-6">
                                Mid-sized protocols (2–5 contracts, 2K–5K LOC)
                            </p>
                            <div className="mb-6">
                                <span className="text-white text-4xl font-bold">$500</span>
                                <span className="text-zinc-400 ml-2">one-time</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Full audit report</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Slack/Discord support</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">2 follow-up reviews</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Gas optimizations</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors font-medium" onClick={() => { window.location.href = '/auth/register' }}>
                                Get Started
                            </button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 transition-all hover:shadow-lg hover:shadow-zinc-900/30">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <Activity size={24} className="text-blue-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Enterprise</h2>
                            </div>
                            <p className="text-zinc-400 text-sm mb-6">
                                Large-scale systems (&gt;5 contracts or &gt;5K LOC)
                            </p>
                            <div className="mb-6">
                                <span className="text-white text-4xl font-bold">$1000</span>
                                <span className="text-zinc-400 ml-2">one-time</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Dedicated team</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Priority queue</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">3 follow-up reviews</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Direct communication</span>
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors font-medium" onClick={() => { window.location.href = '/auth/register' }}>
                                Get Started
                            </button>
                        </div>
                    </div>
                )}

                {/* Early Access Plans */}
                {activeTab === "subscription" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* R3 Early Plan */}
                        <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 transition-all hover:shadow-lg hover:shadow-zinc-900/30">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <Zap size={24} className="text-amber-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">R3 Early</h2>
                            </div>
                            <p className="text-zinc-400 text-sm mb-6">
                                Perfect for startups needing constant security attention
                            </p>
                            <div className="mb-6">
                                <span className="text-white text-4xl font-bold">$300</span>
                                <span className="text-zinc-400 ml-2">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">1 regular audit per month</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Priority queue</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Access to internal tooling</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Early zero-day alerts</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Monthly security reports</span>
                                </li>
                            </ul>
                            <div className="text-xs text-zinc-500 mb-6">3-month minimum commitment</div>
                            <button className="w-full py-3 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors font-medium">
                                Subscribe Now
                            </button>
                        </div>

                        {/* R3 Early+ Plan */}
                        <div className="rounded-xl border border-blue-800/30 bg-gradient-to-br from-zinc-900/90 to-zinc-950 p-6 transition-all hover:shadow-lg hover:shadow-blue-900/20">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-blue-900/30 rounded-lg">
                                    <Shield size={24} className="text-blue-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">R3 Early+</h2>
                            </div>
                            <p className="text-zinc-400 text-sm mb-6">
                                Enhanced protection for fast-moving teams
                            </p>
                            <div className="mb-6">
                                <span className="text-white text-4xl font-bold">$500</span>
                                <span className="text-zinc-400 ml-2">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Everything in Early</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Biweekly security check-ins</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Live contract monitoring</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle size={18} className="text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-zinc-300">Threat modeling for new features</span>
                                </li>
                            </ul>
                            <div className="text-xs text-zinc-500 mb-6">3-month minimum commitment</div>
                            <button className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors font-medium">
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Add-ons Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-white mb-8">Optional Add-Ons</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Add-on 1 */}
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4 hover:bg-zinc-800/80 transition-colors">
                            <div className="flex items-center space-x-3">
                                <AlertTriangle size={20} className="text-amber-400" />
                                <h3 className="text-lg font-semibold text-white">Retest After Patching</h3>
                            </div>
                            <p className="text-zinc-400 text-sm">
                                Verify your fixes with follow-up security testing
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-white font-medium">From $100</span>
                                <span className="text-xs text-zinc-500">Based on changes</span>
                            </div>
                        </div>

                        {/* Add-on 2 */}
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4 hover:bg-zinc-800/80 transition-colors">
                            <div className="flex items-center space-x-3">
                                <Activity size={20} className="text-blue-400" />
                                <h3 className="text-lg font-semibold text-white">Web2/API Pen Test</h3>
                            </div>
                            <p className="text-zinc-400 text-sm">
                                Comprehensive testing of your web and API layers
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-white font-medium">$200 – $500</span>
                                <span className="text-xs text-zinc-500">Based on complexity</span>
                            </div>
                        </div>

                        {/* Add-on 3 */}
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4 hover:bg-zinc-800/80 transition-colors">
                            <div className="flex items-center space-x-3">
                                <Shield size={20} className="text-green-400" />
                                <h3 className="text-lg font-semibold text-white">Bug Bounty Setup</h3>
                            </div>
                            <p className="text-zinc-400 text-sm">
                                Establish a professional bug bounty program
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-white font-medium">$100</span>
                                <span className="text-xs text-zinc-500">One-time setup</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>

                    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/50 transition-colors">
                        <h3 className="text-lg font-semibold text-white mb-2">How long does an audit take?</h3>
                        <p className="text-zinc-400">
                            Standard audits typically take 3-5 business days, Advanced audits 5-10 days, and Enterprise audits 10-15 days depending on complexity and scope.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/50 transition-colors">
                        <h3 className="text-lg font-semibold text-white mb-2">What's included in the audit report?</h3>
                        <p className="text-zinc-400">
                            Our reports include a detailed analysis of vulnerabilities categorized by severity, exploit scenarios, remediation recommendations, and gas optimization suggestions where applicable.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/50 transition-colors">
                        <h3 className="text-lg font-semibold text-white mb-2">Can I upgrade from one plan to another?</h3>
                        <p className="text-zinc-400">
                            Yes, you can easily upgrade from monthly plans or from a one-time audit to a subscription plan. Contact our team for a smooth transition with potential discounts.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 p-8 rounded-xl border border-green-800/20 bg-gradient-to-br from-green-900/10 to-black text-center space-y-6">
                    <h2 className="text-2xl font-bold text-white">Ready to secure your smart contracts?</h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Get started with R3SEC today and benefit from our industry-leading security expertise
                    </p>
                    <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-medium mx-auto">
                        Contact Sales Team
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PricingPage;
