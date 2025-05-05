"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    BarChart2,
    FileWarning,
    Store,
    CheckCircle,
    ArrowRight,
    ChevronRight,
    Monitor,
    RefreshCw,
    Lock,
    Activity,
    Sliders,
    Users,
    PieChart,
    Database,
    Filter
} from "lucide-react";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function Products() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 }
        },
        hover: {
            scale: 1.03,
            boxShadow: "0 10px 30px rgba(0, 255, 128, 0.1)",
            transition: { duration: 0.3 }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1 }
        }
    };

    // Scroll to section handler
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-black text-white">
            <Navbar />
            <motion.div
                className="container mx-auto px-4 py-16 md:py-24"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Products Header */}
                <motion.div
                    className="max-w-4xl mx-auto text-center mb-16"
                    variants={itemVariants}
                >
                    <motion.div
                        className="inline-block mb-6"
                        initial={{ rotate: -5, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                                <span className="text-white">R3</span>
                                <span className="text-green-400">SEC</span> Products
                            </h1>
                        </div>
                    </motion.div>

                    <motion.p
                        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed"
                        variants={itemVariants}
                    >
                        Comprehensive security solutions designed specifically for Solana smart contracts and blockchain applications.
                    </motion.p>
                </motion.div>

                {/* Quick Navigation */}
                <motion.div
                    className="max-w-4xl mx-auto mb-16"
                    variants={itemVariants}
                >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6">Our Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <motion.a
                                href="#smart-contract-audits"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('smart-contract-audits');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <ShieldCheck className="h-5 w-5 text-green-400 mr-3" />
                                <span>Smart Contract Audits</span>
                            </motion.a>

                            <motion.a
                                href="#security-dashboard"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('security-dashboard');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <BarChart2 className="h-5 w-5 text-green-400 mr-3" />
                                <span>Security Dashboard</span>
                            </motion.a>

                            <motion.a
                                href="#vulnerability-reports"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('vulnerability-reports');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <FileWarning className="h-5 w-5 text-green-400 mr-3" />
                                <span>Vulnerability Reports</span>
                            </motion.a>

                            <motion.a
                                href="#audit-marketplace"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('audit-marketplace');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <Store className="h-5 w-5 text-green-400 mr-3" />
                                <span>Audit Marketplace</span>
                            </motion.a>
                        </div>
                    </div>
                </motion.div>

                {/* Smart Contract Audits Section */}
                <section id="smart-contract-audits" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <ShieldCheck className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Smart Contract Audits</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div>
                                <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                                    A comprehensive security audit solution for Solana smart contracts, helping
                                    developers identify and address vulnerabilities before deployment.
                                </p>

                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    Our audit product combines automated scanning with manual expert review to provide
                                    the most thorough security assessment available for Solana programs. Our audits cover
                                    all aspects of smart contract security, from low-level vulnerabilities to high-level
                                    architectural concerns.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Multi-stage Analysis:</span> Combines
                                            automated tools with manual expert review for maximum coverage.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Detailed Reports:</span> Comprehensive
                                            findings with severity ratings, exploit scenarios, and remediation advice.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Remediation Support:</span> Our security
                                            engineers work with your team to address identified vulnerabilities.
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Request an Audit
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </motion.button>
                            </div>

                            <motion.div
                                className="bg-zinc-900 p-0 rounded-xl border border-zinc-800 overflow-hidden"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="bg-zinc-800 p-6">
                                    <h3 className="text-xl font-semibold mb-2">Audit Process</h3>
                                    <p className="text-zinc-400">A systematic approach to identifying vulnerabilities</p>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        <div className="flex items-start">
                                            <div className="flex items-center justify-center rounded-full bg-zinc-800 w-8 h-8 mt-1 mr-4 flex-shrink-0">
                                                <span className="text-green-400 text-sm font-medium">1</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Scoping and Setup</h4>
                                                <p className="text-zinc-400 text-sm">
                                                    We establish audit parameters, review project documentation, and set up the test environment.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex items-center justify-center rounded-full bg-zinc-800 w-8 h-8 mt-1 mr-4 flex-shrink-0">
                                                <span className="text-green-400 text-sm font-medium">2</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Automated Analysis</h4>
                                                <p className="text-zinc-400 text-sm">
                                                    Proprietary tools scan your codebase for known vulnerability patterns and security issues.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex items-center justify-center rounded-full bg-zinc-800 w-8 h-8 mt-1 mr-4 flex-shrink-0">
                                                <span className="text-green-400 text-sm font-medium">3</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Manual Expert Review</h4>
                                                <p className="text-zinc-400 text-sm">
                                                    Our security engineers conduct a detailed review, focusing on logic flaws and complex vulnerabilities.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex items-center justify-center rounded-full bg-zinc-800 w-8 h-8 mt-1 mr-4 flex-shrink-0">
                                                <span className="text-green-400 text-sm font-medium">4</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-2">Reporting and Remediation</h4>
                                                <p className="text-zinc-400 text-sm">
                                                    Delivery of findings and collaboration with your team to address identified issues.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Security Dashboard Section */}
                <section id="security-dashboard" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <BarChart2 className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Security Dashboard</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <motion.div
                                className="md:col-span-2 order-2 md:order-1"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl overflow-hidden">
                                    <div className="bg-[#121212] rounded-lg p-4 h-full">
                                        <div className="border-b border-zinc-800 pb-4 mb-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                                                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                                </div>
                                                <div className="text-zinc-500 text-sm">R3SEC Dashboard</div>
                                            </div>
                                        </div>

                                        <div className="flex mb-6">
                                            <div className="bg-zinc-900 rounded-lg p-4 mr-4 flex-1">
                                                <div className="text-sm text-zinc-500 mb-2">Security Score</div>
                                                <div className="text-2xl font-bold text-green-400">82/100</div>
                                            </div>
                                            <div className="bg-zinc-900 rounded-lg p-4 mr-4 flex-1">
                                                <div className="text-sm text-zinc-500 mb-2">Open Issues</div>
                                                <div className="text-2xl font-bold text-yellow-400">3</div>
                                            </div>
                                            <div className="bg-zinc-900 rounded-lg p-4 flex-1">
                                                <div className="text-sm text-zinc-500 mb-2">Days Secure</div>
                                                <div className="text-2xl font-bold text-green-400">124</div>
                                            </div>
                                        </div>

                                        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-sm font-medium">Active Monitoring</div>
                                                <div className="flex items-center text-green-400 text-sm">
                                                    <div className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                                                    Live
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <Activity className="h-4 w-4 text-zinc-500 mr-2" />
                                                        <span className="text-zinc-400 text-sm">Contract Transactions</span>
                                                    </div>
                                                    <div className="text-zinc-300 text-sm">1,284 today</div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <Users className="h-4 w-4 text-zinc-500 mr-2" />
                                                        <span className="text-zinc-400 text-sm">Unique Users</span>
                                                    </div>
                                                    <div className="text-zinc-300 text-sm">324 today</div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <Lock className="h-4 w-4 text-zinc-500 mr-2" />
                                                        <span className="text-zinc-400 text-sm">Security Incidents</span>
                                                    </div>
                                                    <div className="text-green-400 text-sm">0 today</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-zinc-900 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-sm font-medium">Recent Alerts</div>
                                                <div className="text-zinc-500 text-xs">Last 7 days</div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-start p-2 bg-yellow-900/10 rounded border border-yellow-900/20">
                                                    <div className="p-1 bg-yellow-900/20 rounded mr-3">
                                                        <ChevronRight className="h-3 w-3 text-yellow-500" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium mb-1">Unusual Transaction Pattern</div>
                                                        <div className="text-zinc-400 text-xs">Multiple large withdrawals detected - 2 days ago</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-start p-2 bg-zinc-800/30 rounded border border-zinc-800">
                                                    <div className="p-1 bg-zinc-800 rounded mr-3">
                                                        <ChevronRight className="h-3 w-3 text-zinc-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium mb-1">Contract Update Detected</div>
                                                        <div className="text-zinc-400 text-xs">New proxy implementation deployed - 5 days ago</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="order-1 md:order-2">
                                <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                                    Monitor your smart contracts in real-time with our comprehensive security dashboard.
                                </p>

                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    The R3SEC Security Dashboard provides continuous monitoring of your deployed
                                    smart contracts, detecting suspicious activities and alerting you to potential security threats.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Real-time Monitoring:</span> Track
                                            all interactions with your smart contracts as they happen.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Anomaly Detection:</span> AI-powered
                                            algorithms identify unusual patterns that might indicate an attack.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Customizable Alerts:</span> Configure
                                            notification thresholds based on your project's specific security requirements.
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Request Demo Access
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Vulnerability Reports Section */}
                <section id="vulnerability-reports" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <FileWarning className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Vulnerability Reports</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="md:col-span-2">
                                <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                                    Detailed, actionable security reports that help you understand and address
                                    vulnerabilities in your Solana smart contracts.
                                </p>

                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    Our vulnerability reports go beyond simply listing issues. Each report provides
                                    a comprehensive analysis of the security vulnerabilities found in your code,
                                    with clear explanations, risk assessments, and practical remediation guidance.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Severity Ratings:</span> Each
                                            vulnerability is assigned a CVSS-based severity score to help prioritize remediation efforts.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Exploit Scenarios:</span> Detailed
                                            explanations of how vulnerabilities could be exploited in real-world situations.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Code Samples:</span> Example
                                            code showing both vulnerable patterns and secure implementations.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <motion.button
                                        className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        View Sample Report
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </motion.button>
                                </div>
                            </div>

                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                                    <div className="bg-zinc-800 p-6">
                                        <h3 className="text-xl font-semibold mb-2">Report Features</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-6">
                                            <div className="flex items-start">
                                                <div className="bg-zinc-800 p-2 rounded-full mr-3 flex-shrink-0">
                                                    <Filter className="h-5 w-5 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Vulnerability Classification</h4>
                                                    <p className="text-zinc-400 text-sm">
                                                        Issues categorized by type, source, and impact to facilitate understanding and remediation.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-zinc-800 p-2 rounded-full mr-3 flex-shrink-0">
                                                    <PieChart className="h-5 w-5 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Risk Assessment</h4>
                                                    <p className="text-zinc-400 text-sm">
                                                        Quantitative and qualitative evaluation of security risks with business impact analysis.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-zinc-800 p-2 rounded-full mr-3 flex-shrink-0">
                                                    <Database className="h-5 w-5 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Historical Tracking</h4>
                                                    <p className="text-zinc-400 text-sm">
                                                        Compare reports across audit iterations to track security improvements over time.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                                                <div className="flex items-center justify-center text-zinc-400 mb-2">
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    <span className="text-sm">Updated weekly with new vulnerabilities</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Example Report Preview */}
                        <motion.div
                            className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <div className="p-6 md:p-8">
                                <h3 className="text-xl font-semibold mb-6">Sample Vulnerability Entry</h3>

                                <div className="bg-[#121212] rounded-lg p-6 border border-zinc-800">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="text-lg font-medium mb-1">
                                                Unchecked Account Ownership
                                            </div>
                                            <div className="text-zinc-500 text-sm">
                                                ID: RSEC-2025-042
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-red-900/20 border border-red-900/30 rounded-lg text-red-400 text-sm font-medium">
                                            Critical Severity
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <div className="text-sm font-medium mb-2 text-zinc-300">Description</div>
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                The contract does not properly validate account ownership before performing sensitive operations.
                                                This allows attackers to manipulate the program by passing their own accounts instead of the
                                                expected system-owned accounts.
                                            </p>
                                        </div>

                                        <div>
                                            <div className="text-sm font-medium mb-2 text-zinc-300">Impact</div>
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                An attacker could gain unauthorized access to locked tokens, manipulate voting results,
                                                or drain funds from the protocol by exploiting this vulnerability.
                                            </p>
                                        </div>

                                        <div>
                                            <div className="text-sm font-medium mb-2 text-zinc-300">Vulnerable Code</div>
                                            <div className="bg-zinc-900 p-3 rounded-lg text-sm font-mono text-zinc-400 overflow-x-auto">
                                                <pre>{`pub fn process_withdraw(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let vault = next_account_info(account_info_iter)?;
    
    // Missing ownership check here
    
    **vault.try_borrow_mut_lamports()? -= amount;
    **user.try_borrow_mut_lamports()? += amount;
    
    Ok(())
}`}</pre>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm font-medium mb-2 text-zinc-300">Recommendation</div>
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                Implement proper ownership validation by adding the following check before performing
                                                sensitive operations:
                                            </p>
                                            <div className="bg-zinc-900 p-3 rounded-lg text-sm font-mono text-zinc-400 mt-2 overflow-x-auto">
                                                <pre>{`// Verify vault is owned by the program
if vault.owner != program_id {
    return Err(ProgramError::IncorrectProgramId);
}

// Verify vault data is initialized correctly
let vault_data = VaultState::try_from_slice(&vault.data.borrow())?;`}</pre>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                                        <div className="flex items-center text-zinc-400 text-sm">
                                            <div className="mr-6">
                                                <span className="font-medium text-zinc-300">Status:</span> Open
                                            </div>
                                            <div>
                                                <span className="font-medium text-zinc-300">Reported:</span> May 2, 2025
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Audit Marketplace Section */}
                <section id="audit-marketplace" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <Store className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Audit Marketplace</h2>
                        </div>

                        <p className="text-lg text-zinc-300 mb-6 leading-relaxed max-w-3xl">
                            Connect with vetted security auditors and manage the entire audit process through our streamlined marketplace platform.
                        </p>

                        <p className="text-zinc-400 mb-12 leading-relaxed max-w-3xl">
                            The R3SEC Audit Marketplace brings together project developers and security experts in a
                            transparent, efficient environment. Find the right auditor for your specific needs,
                            manage the entire audit process, and access a standardized reporting framework.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            <motion.div
                                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="p-6">
                                    <div className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                                        <Users className="h-8 w-8 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4">Verified Auditors</h3>
                                    <p className="text-zinc-400 mb-6">
                                        Access a network of vetted security experts with proven experience in Solana smart contract auditing.
                                        Each auditor is thoroughly evaluated based on technical expertise, past audits, and community reputation.
                                    </p>

                                    <ul className="space-y-2 text-zinc-400">
                                        <li className="flex items-start">
                                            <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                                <CheckCircle className="h-3 w-3 text-green-400" />
                                            </div>
                                            <span className="text-sm">Specialized expertise matching</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                                <CheckCircle className="h-3 w-3 text-green-400" />
                                            </div>
                                            <span className="text-sm">Verified track records</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                                <CheckCircle className="h-3 w-3 text-green-400" />
                                            </div>
                                            <span className="text-sm">Transparent rating system</span>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="p-6">
                                    <div className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                                        <Sliders className="h-8 w-8 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4">Streamlined Process</h3>
                                    <p className="text-zinc-400 mb-6">
                                        Manage the entire audit workflow in one place, from initial submission to final report delivery.
                                        Our platform handles payments, communication, and documentation to create a seamless experience.
                                    </p>

                                    <ul className="space-y-2 text-zinc-400">
                                        <li className="flex items-start">
                                            <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                                <CheckCircle className="h-3 w-3 text-green-400" />
                                            </div>
                                            <span className="text-sm">Simplified code submission</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                                <CheckCircle className="h-3 w-3 text-green-400" />
                                            </div>
                                            <span className="text-sm">Escrow payment protection</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                                <CheckCircle className="h-3 w-3 text-green-400" />
                                            </div>
                                            <span className="text-sm">Real-time status updates</span>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="p-6">
                                    <div className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                                        <Monitor className="h-8 w-8 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4">Standardized Reporting</h3>
                                    <p className="text-zinc-400 mb-6">
                                        All audits conducted through our marketplace follow a consistent, comprehensive reporting
                                        framework that ensures clarity and actionable insights for every project.
                                    </p>

                                    <ul className="space-y-2 text-zinc-400">
                                        <li className="flex items-start">
                                            <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                                <CheckCircle className="h-3 w-3 text-green-400" />
                                            </div>
                                            <span className="text-sm">Uniform vulnerability classification</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                                <CheckCircle className="h-3 w-3 text-green-400" />
                                            </div>
                                            <span className="text-sm">Detailed remediation guidance</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                                <CheckCircle className="h-3 w-3 text-green-400" />
                                            </div>
                                            <span className="text-sm">Executive summaries for stakeholders</span>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>
                        </div>

                        {/* Marketplace Preview */}
                        <motion.div
                            className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden p-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">How It Works</h3>
                                    <p className="text-zinc-400">
                                        Find and engage with the perfect security auditor in just a few steps
                                    </p>
                                </div>

                                <motion.button
                                    className="mt-4 md:mt-0 bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium inline-flex items-center"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Launch Marketplace
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                                    <div className="flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-full mb-4 mx-auto">
                                        <div className="text-green-400 font-medium">1</div>
                                    </div>
                                    <h4 className="text-center font-medium mb-3">Submit Project</h4>
                                    <p className="text-zinc-400 text-sm text-center">
                                        Upload your code and specify your audit requirements and timeline
                                    </p>
                                </div>

                                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                                    <div className="flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-full mb-4 mx-auto">
                                        <div className="text-green-400 font-medium">2</div>
                                    </div>
                                    <h4 className="text-center font-medium mb-3">Receive Proposals</h4>
                                    <p className="text-zinc-400 text-sm text-center">
                                        Review audit proposals from qualified experts matched to your needs
                                    </p>
                                </div>

                                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                                    <div className="flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-full mb-4 mx-auto">
                                        <div className="text-green-400 font-medium">3</div>
                                    </div>
                                    <h4 className="text-center font-medium mb-3">Track Progress</h4>
                                    <p className="text-zinc-400 text-sm text-center">
                                        Monitor the audit process and communicate directly with your auditor
                                    </p>
                                </div>

                                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                                    <div className="flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-full mb-4 mx-auto">
                                        <div className="text-green-400 font-medium">4</div>
                                    </div>
                                    <h4 className="text-center font-medium mb-3">Receive Report</h4>
                                    <p className="text-zinc-400 text-sm text-center">
                                        Get your comprehensive audit report and remediation guidance
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Product Integration */}
                <motion.div
                    className="max-w-5xl mx-auto mb-24"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 md:p-12">
                        <motion.div
                            className="text-center mb-12"
                            variants={itemVariants}
                        >
                            <h2 className="text-3xl font-bold mb-4">
                                Comprehensive Security Coverage
                            </h2>
                            <p className="text-zinc-400 max-w-3xl mx-auto">
                                Our products work together to provide end-to-end security for your Solana projects
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-xl font-semibold mb-4">Development Phase</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-zinc-800 p-1 rounded mr-3 mt-1">
                                            <ChevronRight className="h-4 w-4 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-zinc-300 font-medium">Smart Contract Audits</p>
                                            <p className="text-zinc-400 text-sm">
                                                Identify vulnerabilities before deployment
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-zinc-800 p-1 rounded mr-3 mt-1">
                                            <ChevronRight className="h-4 w-4 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-zinc-300 font-medium">Vulnerability Reports</p>
                                            <p className="text-zinc-400 text-sm">
                                                Actionable guidance for secure implementation
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-xl font-semibold mb-4">Production Phase</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-zinc-800 p-1 rounded mr-3 mt-1">
                                            <ChevronRight className="h-4 w-4 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-zinc-300 font-medium">Security Dashboard</p>
                                            <p className="text-zinc-400 text-sm">
                                                Real-time monitoring of deployed contracts
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-zinc-800 p-1 rounded mr-3 mt-1">
                                            <ChevronRight className="h-4 w-4 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-zinc-300 font-medium">Audit Marketplace</p>
                                            <p className="text-zinc-400 text-sm">
                                                Ongoing security assessments for updates and new features
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-zinc-400 mb-6">
                                Get in touch to learn how our products can be customized for your specific security requirements.
                            </p>
                            <motion.button
                                className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-lg font-medium"
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                            >
                                Contact Our Team
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    className="max-w-4xl mx-auto text-center mt-24 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div
                        className="flex items-center justify-center mb-6"
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <ShieldCheck className="h-6 w-6 text-green-400 mr-2" />
                        <p className="text-green-400 font-medium">Secure your Solana applications with confidence</p>
                    </motion.div>

                    <motion.h3
                        className="text-2xl md:text-4xl font-bold mb-8"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Ready to enhance your security posture?
                    </motion.h3>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <motion.button
                            className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-lg font-medium text-lg inline-flex items-center"
                            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                        >
                            Schedule a Demo
                            <motion.div
                                className="ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <ArrowRight size={18} />
                            </motion.div>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
            <Footer />
        </div>
    );
}
