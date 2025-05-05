"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Code,
    Users,
    Building,
    Search,
    CheckCircle,
    ArrowRight,
    ChevronRight,
    Shield,
    Clock,
    Lock,
    DollarSign,
    FileWarning,
    Target,
    BrainCircuit,
    BookOpen,
    BarChart2,
    GanttChartSquare,
    Handshake
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Solutions() {
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

    // Testimonials data
    const testimonials = [
        {
            quote: "R3SEC's security audit process is incredibly thorough. They found critical issues our internal team missed, potentially saving us millions in lost funds.",
            author: "Alex Chen",
            role: "CTO at SolanaSwap"
        },
        {
            quote: "Working with R3SEC has given our DAO members confidence that our treasury management contracts are secure and robust against attacks.",
            author: "Maya Williams",
            role: "Core Contributor, MetaDAO"
        },
        {
            quote: "The monitoring dashboard has already helped us catch unusual transaction patterns that could have led to a security incident.",
            author: "Raj Patel",
            role: "Security Lead, Enterprise Blockchain Division"
        }
    ];

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
                {/* Solutions Header */}
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
                                <span className="text-green-400">SEC</span> Solutions
                            </h1>
                        </div>
                    </motion.div>

                    <motion.p
                        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed"
                        variants={itemVariants}
                    >
                        Tailored security solutions for every participant in the Solana ecosystem.
                    </motion.p>
                </motion.div>

                {/* Quick Navigation */}
                <motion.div
                    className="max-w-4xl mx-auto mb-16"
                    variants={itemVariants}
                >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6">Solutions For</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <motion.a
                                href="#for-developers"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('for-developers');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <Code className="h-5 w-5 text-green-400 mr-3" />
                                <span>For Developers</span>
                            </motion.a>

                            <motion.a
                                href="#for-daos"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('for-daos');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <Users className="h-5 w-5 text-green-400 mr-3" />
                                <span>For DAOs</span>
                            </motion.a>

                            <motion.a
                                href="#for-enterprises"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('for-enterprises');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <Building className="h-5 w-5 text-green-400 mr-3" />
                                <span>For Enterprises</span>
                            </motion.a>

                            <motion.a
                                href="#for-auditors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('for-auditors');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <Search className="h-5 w-5 text-green-400 mr-3" />
                                <span>For Auditors</span>
                            </motion.a>
                        </div>
                    </div>
                </motion.div>

                {/* For Developers Section */}
                <section id="for-developers" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <Code className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">For Developers</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                            <div className="md:col-span-3">
                                <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                                    Build with confidence. Our developer-focused solutions help you create
                                    secure Solana programs from the ground up, ensuring your code is robust
                                    against exploits and vulnerabilities.
                                </p>

                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    Whether you're a solo developer or part of a team, our tools and services
                                    integrate directly into your development workflow, providing security insights
                                    when and where you need them most.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Code Review Integrations:</span> Security
                                            checks integrated directly into your GitHub workflow.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Security Training:</span> Developer-focused
                                            workshops on Solana security best practices.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Affordable Audit Options:</span> Right-sized
                                            security solutions for projects of every scale.
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Developer Resources
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </motion.button>
                            </div>

                            <motion.div
                                className="md:col-span-2"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full">
                                    <div className="bg-zinc-800 p-6">
                                        <h3 className="text-xl font-semibold mb-2">Developer Solutions</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-6">
                                            <div className="flex items-start">
                                                <div className="bg-zinc-800 p-2 rounded-lg mr-4 flex-shrink-0">
                                                    <Shield className="h-6 w-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-medium mb-2">Security SDK</h4>
                                                    <p className="text-zinc-400 text-sm">
                                                        Drop-in security components and patterns for common Solana development challenges.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-zinc-800 p-2 rounded-lg mr-4 flex-shrink-0">
                                                    <Target className="h-6 w-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-medium mb-2">Focused Audits</h4>
                                                    <p className="text-zinc-400 text-sm">
                                                        Targeted security reviews for specific components or critical functionality.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-zinc-800 p-2 rounded-lg mr-4 flex-shrink-0">
                                                    <BrainCircuit className="h-6 w-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-medium mb-2">AI-Assisted Testing</h4>
                                                    <p className="text-zinc-400 text-sm">
                                                        Automated security testing powered by machine learning to find edge cases.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-zinc-800">
                                            <a
                                                href="#"
                                                className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                                            >
                                                Browse documentation
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Case Study */}
                        <motion.div
                            className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                    <div>
                                        <div className="text-sm text-green-400 mb-2 font-medium">CASE STUDY</div>
                                        <h3 className="text-xl font-semibold mb-2 md:mb-0">How SolDEX Secured Their AMM Protocol</h3>
                                    </div>
                                    <motion.button
                                        className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center mt-4 md:mt-0"
                                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                    >
                                        Read Full Case Study
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </motion.button>
                                </div>

                                <div className="bg-zinc-900 rounded-lg p-6">
                                    <p className="text-zinc-400 mb-6 leading-relaxed">
                                        SolDEX integrated R3SEC's security solutions throughout their development process,
                                        from initial architecture reviews to final deployment. Our team identified and
                                        helped fix 12 potential vulnerabilities, including a critical reentrancy issue
                                        that could have compromised user funds.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-zinc-800/50 rounded-lg p-4">
                                            <div className="text-green-400 text-3xl font-bold mb-2">98%</div>
                                            <div className="text-zinc-300 font-medium">Critical Issues Fixed</div>
                                        </div>

                                        <div className="bg-zinc-800/50 rounded-lg p-4">
                                            <div className="text-green-400 text-3xl font-bold mb-2">$5M+</div>
                                            <div className="text-zinc-300 font-medium">Protected on Launch</div>
                                        </div>

                                        <div className="bg-zinc-800/50 rounded-lg p-4">
                                            <div className="text-green-400 text-3xl font-bold mb-2">4 weeks</div>
                                            <div className="text-zinc-300 font-medium">Time-to-Market</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* For DAOs Section */}
                <section id="for-daos" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <Users className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">For DAOs</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                            <div className="md:col-span-3">
                                <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                                    Protect your treasury and governance mechanisms with security solutions designed
                                    specifically for decentralized autonomous organizations.
                                </p>

                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    DAOs face unique security challenges, from treasury management to voting systems.
                                    Our specialized solutions help decentralized communities secure their funds and
                                    operations while maintaining transparency and trust.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Treasury Protection:</span> Security
                                            systems designed specifically for multi-signature wallets and governance contracts.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Governance Audits:</span> Specialized
                                            reviews of voting mechanisms and proposal execution systems.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Community Reporting:</span> Transparent
                                            security reports designed to be shared with and understood by DAO members.
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    DAO Security Solutions
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </motion.button>
                            </div>

                            <motion.div
                                className="md:col-span-2"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full">
                                    <div className="bg-zinc-800 p-6">
                                        <h3 className="text-xl font-semibold mb-2">DAO Security Focus Areas</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-6">
                                            <div className="flex items-start">
                                                <div className="bg-zinc-800 p-2 rounded-lg mr-4 flex-shrink-0">
                                                    <DollarSign className="h-6 w-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-medium mb-2">Treasury Security</h4>
                                                    <p className="text-zinc-400 text-sm">
                                                        Robust protection mechanisms for community-controlled funds and assets.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-zinc-800 p-2 rounded-lg mr-4 flex-shrink-0">
                                                    <GanttChartSquare className="h-6 w-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-medium mb-2">Governance Protection</h4>
                                                    <p className="text-zinc-400 text-sm">
                                                        Secure voting systems and proposal execution mechanisms.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="bg-zinc-800 p-2 rounded-lg mr-4 flex-shrink-0">
                                                    <BookOpen className="h-6 w-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-medium mb-2">Education Programs</h4>
                                                    <p className="text-zinc-400 text-sm">
                                                        Security training for core contributors and community members.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-zinc-800">
                                            <a
                                                href="#"
                                                className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                                            >
                                                See DAO security guide
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* DAO Security Risks */}
                        <motion.div
                            className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <div className="p-6 md:p-8">
                                <h3 className="text-xl font-semibold mb-6">Common DAO Security Risks</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
                                        <div className="flex items-center mb-4">
                                            <div className="p-2 bg-red-900/20 rounded-lg mr-3">
                                                <FileWarning className="h-5 w-5 text-red-400" />
                                            </div>
                                            <h4 className="font-medium">Proposal Hijacking</h4>
                                        </div>
                                        <p className="text-zinc-400 text-sm">
                                            Malicious proposals that appear benign but contain hidden execution paths that
                                            can drain treasury funds or change governance parameters.
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-zinc-800 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Risk Level:</span>
                                                <span className="text-red-400 font-medium">Critical</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
                                        <div className="flex items-center mb-4">
                                            <div className="p-2 bg-orange-900/20 rounded-lg mr-3">
                                                <Lock className="h-5 w-5 text-orange-400" />
                                            </div>
                                            <h4 className="font-medium">Multisig Compromise</h4>
                                        </div>
                                        <p className="text-zinc-400 text-sm">
                                            Inadequate security of multisignature wallets, including insufficient
                                            key management practices or vulnerable signing thresholds.
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-zinc-800 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Risk Level:</span>
                                                <span className="text-orange-400 font-medium">High</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
                                        <div className="flex items-center mb-4">
                                            <div className="p-2 bg-yellow-900/20 rounded-lg mr-3">
                                                <Clock className="h-5 w-5 text-yellow-400" />
                                            </div>
                                            <h4 className="font-medium">Time-Based Attacks</h4>
                                        </div>
                                        <p className="text-zinc-400 text-sm">
                                            Vulnerabilities in voting periods, time locks, or execution delays that
                                            can be exploited to bypass governance safeguards.
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-zinc-800 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Risk Level:</span>
                                                <span className="text-yellow-400 font-medium">Medium</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
                                        <div className="flex items-center mb-4">
                                            <div className="p-2 bg-blue-900/20 rounded-lg mr-3">
                                                <Target className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <h4 className="font-medium">Governance Attacks</h4>
                                        </div>
                                        <p className="text-zinc-400 text-sm">
                                            Manipulation of voting mechanisms through token accumulation, flash loans,
                                            or other tactics to gain disproportionate influence.
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-zinc-800 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Risk Level:</span>
                                                <span className="text-blue-400 font-medium">Variable</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <motion.button
                                        className="bg-zinc-800 text-white px-6 py-3 rounded-lg text-sm inline-flex items-center"
                                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                    >
                                        Download Complete DAO Security Checklist
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* For Enterprises Section */}
                <section id="for-enterprises" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <Building className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">For Enterprises</h2>
                        </div>

                        {/* Enterprise section content here */}
                        {/* Similar structure to previous sections */}
                    </motion.div>
                </section>

                {/* For Auditors Section */}
                <section id="for-auditors" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <Search className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">For Auditors</h2>
                        </div>

                        {/* Auditors section content here */}
                        {/* Similar structure to previous sections */}
                    </motion.div>
                </section>

                {/* Testimonials */}
                <motion.div
                    className="max-w-5xl mx-auto mb-24"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div
                        className="text-center mb-12"
                        variants={itemVariants}
                    >
                        <h2 className="text-3xl font-bold mb-4">
                            Trusted by Leaders Across the Ecosystem
                        </h2>
                        <p className="text-zinc-400 max-w-3xl mx-auto">
                            Here's what our clients say about our security solutions
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="text-green-400 mr-1">★</div>
                                    ))}
                                </div>
                                <p className="text-zinc-300 mb-6 italic">
                                    "{testimonial.quote}"
                                </p>
                                <div>
                                    <p className="font-medium">{testimonial.author}</p>
                                    <p className="text-zinc-500 text-sm">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
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
                        <Shield className="h-6 w-6 text-green-400 mr-2" />
                        <p className="text-green-400 font-medium">Security solutions for every stage of your project</p>
                    </motion.div>

                    <motion.h3
                        className="text-2xl md:text-4xl font-bold mb-8"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Ready to secure your Solana project?
                    </motion.h3>

                    <motion.p
                        className="text-zinc-400 mb-8 max-w-3xl mx-auto"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        Whether you're a developer, DAO, enterprise, or auditor, we have tailored security solutions to meet your needs.
                    </motion.p>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <motion.button
                            className="bg-green-500 hover:bg-green-600 text-black px-6 py-4 rounded-lg font-medium text-lg inline-flex items-center justify-center"
                            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                        >
                            Schedule a Consultation
                            <motion.div
                                className="ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <ArrowRight size={18} />
                            </motion.div>
                        </motion.button>

                        <motion.button
                            className="bg-transparent border border-zinc-700 hover:border-green-500 text-white px-6 py-4 rounded-lg font-medium text-lg transition-all"
                            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                        >
                            View Security Resources
                        </motion.button>
                    </motion.div>

                    <motion.div
                        className="mt-16 pt-8 border-t border-zinc-800 text-zinc-500 text-sm text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        Trusted by leading Solana protocols, DAOs, developers, and enterprises
                    </motion.div>
                </motion.div>
            </motion.div>
            <Footer />
        </div>
    );
}
