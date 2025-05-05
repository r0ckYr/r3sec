"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    EyeIcon,
    Code,
    Bug,
    CheckCircle,
    ArrowRight,
    Clock,
    Zap,
    FileCheck,
    Users,
    ChevronRight
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Services() {
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

    const processSteps = [
        {
            title: "Initial Scope Assessment",
            description: "We begin by understanding your project's architecture, codebase, and specific security concerns."
        },
        {
            title: "Vulnerability Scanning",
            description: "Automated tools identify common security issues as a first pass before our experts dig deeper."
        },
        {
            title: "Manual Code Review",
            description: "Our security engineers meticulously examine your code for complex vulnerabilities and logical flaws."
        },
        {
            title: "Security Report Delivery",
            description: "You receive a comprehensive report detailing all findings with severity ratings and remediation advice."
        },
        {
            title: "Remediation Support",
            description: "We guide your team through fixing identified issues and verify the effectiveness of your solutions."
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
                {/* Services Header */}
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
                                <span className="text-green-400">SEC</span> Services
                            </h1>
                        </div>
                    </motion.div>

                    <motion.p
                        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed"
                        variants={itemVariants}
                    >
                        Comprehensive security solutions to protect your Solana projects at every stage of development.
                    </motion.p>
                </motion.div>

                {/* Quick Navigation */}
                <motion.div
                    className="max-w-4xl mx-auto mb-16"
                    variants={itemVariants}
                >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6">Our Services</h2>
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
                                href="#security-monitoring"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('security-monitoring');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <EyeIcon className="h-5 w-5 text-green-400 mr-3" />
                                <span>Security Monitoring</span>
                            </motion.a>

                            <motion.a
                                href="#code-review"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('code-review');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <Code className="h-5 w-5 text-green-400 mr-3" />
                                <span>Code Review</span>
                            </motion.a>

                            <motion.a
                                href="#bug-bounty-programs"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('bug-bounty-programs');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <Bug className="h-5 w-5 text-green-400 mr-3" />
                                <span>Bug Bounty Programs</span>
                            </motion.a>
                        </div>
                    </div>
                </motion.div>

                {/* Process Overview */}
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
                            Our <span className="text-green-400">Process</span>
                        </h2>
                        <p className="text-zinc-400 max-w-3xl mx-auto">
                            A systematic approach to identifying and mitigating security vulnerabilities in your projects
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Process line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-zinc-800 -ml-0.5 hidden md:block"></div>

                        <div className="space-y-12">
                            {processSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="relative"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    <div className={`md:flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        <div className="flex md:w-1/2 md:justify-end md:pr-8">
                                            <div className={`bg-zinc-900 border border-zinc-800 p-6 rounded-xl ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                                <div className="flex items-center mb-4 md:hidden">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-900/30 text-green-400 mr-4">
                                                        {index + 1}
                                                    </div>
                                                    <h3 className="text-xl font-semibold">{step.title}</h3>
                                                </div>
                                                <h3 className={`text-xl font-semibold mb-2 hidden md:block`}>
                                                    {step.title}
                                                </h3>
                                                <p className="text-zinc-400">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-900/30 text-green-400 font-bold">
                                                {index + 1}
                                            </div>
                                        </div>

                                        <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
                                    </div>
                                </motion.div>
                            ))}
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="md:col-span-2">
                                <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                                    Our flagship service provides comprehensive security assessments of Solana smart contracts,
                                    identifying vulnerabilities before they can be exploited.
                                </p>

                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    Through a combination of automated analysis and manual review by security experts,
                                    we thoroughly examine your code for both common vulnerabilities and complex,
                                    protocol-specific issues that automated tools might miss.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Comprehensive Vulnerability Assessment:</span> Thorough
                                            examination of your smart contracts for security flaws and vulnerabilities.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Detailed Security Reports:</span> Clear,
                                            actionable findings with severity ratings and practical remediation steps.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Remediation Support:</span> Guidance
                                            on fixing identified issues and verification of your implemented solutions.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <motion.button
                                        className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center"
                                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                    >
                                        Request an Audit
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </motion.button>

                                    <motion.button
                                        className="bg-transparent border border-zinc-700 hover:border-green-500 text-white px-6 py-3 rounded-lg font-medium text-lg transition-all"
                                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                    >
                                        View Sample Report
                                    </motion.button>
                                </div>
                            </div>

                            <motion.div
                                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-6">Audit Packages</h3>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-zinc-800 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium">Standard Audit</h4>
                                                <div className="text-green-400 text-sm">
                                                    1-2 weeks
                                                </div>
                                            </div>
                                            <p className="text-zinc-400 text-sm">
                                                Thorough security assessment for most Solana projects
                                            </p>
                                        </div>

                                        <div className="p-4 bg-zinc-800 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium">Express Audit</h4>
                                                <div className="text-green-400 text-sm">
                                                    72 hours
                                                </div>
                                            </div>
                                            <p className="text-zinc-400 text-sm">
                                                Expedited review for projects with tight deadlines
                                            </p>
                                        </div>

                                        <div className="p-4 bg-zinc-800 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium">Comprehensive Audit</h4>
                                                <div className="text-green-400 text-sm">
                                                    2-4 weeks
                                                </div>
                                            </div>
                                            <p className="text-zinc-400 text-sm">
                                                Deep dive for complex DeFi protocols and high-TVL applications
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-zinc-800">
                                        <div className="flex items-center text-zinc-400">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <span className="text-sm">
                                                Time estimates depend on codebase size and complexity
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Security Monitoring Section */}
                <section id="security-monitoring" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <EyeIcon className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Security Monitoring</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="md:col-span-2">
                                <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                                    Ongoing protection for your deployed smart contracts with continuous monitoring
                                    and real-time threat detection services.
                                </p>

                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    Our security monitoring service provides continuous surveillance of your
                                    on-chain activity, looking for suspicious transactions, unusual patterns,
                                    and potential exploits. Get real-time alerts and rapid response support
                                    when potential security incidents are detected.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">24/7 Transaction Monitoring:</span> Continuous
                                            surveillance of all interactions with your smart contracts.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Anomaly Detection:</span> AI-powered
                                            analysis to identify unusual patterns that might indicate an attack.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Rapid Incident Response:</span> Emergency
                                            support from our security team when potential threats are detected.
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center"
                                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                >
                                    Learn More
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </motion.button>
                            </div>

                            <motion.div
                                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-6">Key Features</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="bg-zinc-800 p-2 rounded-full mr-3">
                                                <Zap className="h-5 w-5 text-green-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Real-Time Alerts</h4>
                                                <p className="text-zinc-400 text-sm">
                                                    Instant notifications for suspicious activities
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-zinc-800 p-2 rounded-full mr-3">
                                                <FileCheck className="h-5 w-5 text-green-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Detailed Reports</h4>
                                                <p className="text-zinc-400 text-sm">
                                                    Weekly security status summaries
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-zinc-800 p-2 rounded-full mr-3">
                                                <Users className="h-5 w-5 text-green-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Dedicated Support</h4>
                                                <p className="text-zinc-400 text-sm">
                                                    Security engineer assigned to your project
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Code Review Section */}
                <section id="code-review" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <Code className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Code Review</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                            <div className="md:col-span-8">
                                <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                                    Proactive code reviews to improve quality and identify security issues during the development process.
                                </p>

                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    Integrate security into your development workflow with our code review service.
                                    Our engineers provide feedback on your code as it's being written, helping you
                                    build more secure applications from the ground up.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">GitHub Integration:</span> Seamless
                                            reviews directly in your pull requests and code repositories.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Regular Check-ins:</span> Scheduled
                                            review sessions with our security engineers for direct feedback.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Best Practice Guidance:</span> Expert
                                            recommendations on secure coding patterns and optimization.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <motion.button
                                        className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center"
                                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                    >
                                        Book a Code Review
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </motion.button>
                                </div>
                            </div>

                            <motion.div
                                className="md:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-6">Why Code Review?</h3>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <ChevronRight className="h-4 w-4 text-green-400 mr-2" />
                                                <h4 className="font-medium">10x Cost Efficiency</h4>
                                            </div>
                                            <p className="text-zinc-400 text-sm">
                                                Addressing security issues during development is 10 times cheaper than fixing them post-deployment
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center mb-2">
                                                <ChevronRight className="h-4 w-4 text-green-400 mr-2" />
                                                <h4 className="font-medium">Developer Education</h4>
                                            </div>
                                            <p className="text-zinc-400 text-sm">
                                                Your team gains valuable security knowledge through direct collaboration with our experts
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center mb-2">
                                                <ChevronRight className="h-4 w-4 text-green-400 mr-2" />
                                                <h4 className="font-medium">Reduced Audit Scope</h4>
                                            </div>
                                            <p className="text-zinc-400 text-sm">
                                                Prior code reviews significantly reduce the time and cost of your final security audit
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Bug Bounty Programs Section */}
                <section id="bug-bounty-programs" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <Bug className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Bug Bounty Programs</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="md:col-span-2">
                                <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                                    Leverage the global security researcher community to identify vulnerabilities in your deployed applications.
                                </p>

                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    Our managed bug bounty programs connect your project with a curated network of security
                                    researchers who are incentivized to find and responsibly disclose vulnerabilities.
                                    We handle all aspects of the program, from setup and researcher communication to
                                    triage and validation of reported issues.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Expert Program Management:</span> We handle researcher
                                            communication, vulnerability triage, and reward payments.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Vetted Researcher Network:</span> Access to
                                            security professionals with specific expertise in Solana and blockchain applications.
                                        </p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-900/20 p-1 rounded-full mr-3 mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-zinc-400">
                                            <span className="text-white font-medium">Vulnerability Validation:</span> Our team
                                            verifies all submissions and provides risk assessments before you pay rewards.
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center"
                                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                >
                                    Launch a Bug Bounty
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </motion.button>
                            </div>

                            <motion.div
                                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-6">Program Options</h3>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-zinc-800 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium">Private Program</h4>
                                            </div>
                                            <p className="text-zinc-400 text-sm">
                                                Invitation-only program with selected security researchers
                                            </p>
                                        </div>

                                        <div className="p-4 bg-zinc-800 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium">Public Program</h4>
                                            </div>
                                            <p className="text-zinc-400 text-sm">
                                                Open to all researchers in our network with maximum visibility
                                            </p>
                                        </div>

                                        <div className="p-4 bg-zinc-800 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium">Custom Program</h4>
                                            </div>
                                            <p className="text-zinc-400 text-sm">
                                                Tailored approach based on your specific security and budget requirements
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-zinc-800">
                                        <div className="flex items-center text-zinc-400">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <span className="text-sm">
                                                Programs can be set up in as little as 48 hours
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Service Comparison */}
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
                                Which Service is Right for You?
                            </h2>
                            <p className="text-zinc-400 max-w-3xl mx-auto">
                                Compare our services to find the best fit for your project's current stage and security needs
                            </p>
                        </motion.div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full">
                                <thead>
                                    <tr className="border-b border-zinc-800">
                                        <th className="py-4 px-6 text-left">Service</th>
                                        <th className="py-4 px-6 text-left">Best For</th>
                                        <th className="py-4 px-6 text-left">Timeline</th>
                                        <th className="py-4 px-6 text-left">Key Benefit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                                        <td className="py-4 px-6 font-medium">Smart Contract Audits</td>
                                        <td className="py-4 px-6 text-zinc-400">Pre-deployment validation</td>
                                        <td className="py-4 px-6 text-zinc-400">1-4 weeks</td>
                                        <td className="py-4 px-6 text-zinc-400">Comprehensive security assessment</td>
                                    </tr>
                                    <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                                        <td className="py-4 px-6 font-medium">Security Monitoring</td>
                                        <td className="py-4 px-6 text-zinc-400">Live production applications</td>
                                        <td className="py-4 px-6 text-zinc-400">Ongoing</td>
                                        <td className="py-4 px-6 text-zinc-400">Real-time threat detection</td>
                                    </tr>
                                    <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                                        <td className="py-4 px-6 font-medium">Code Review</td>
                                        <td className="py-4 px-6 text-zinc-400">Development phase</td>
                                        <td className="py-4 px-6 text-zinc-400">1-3 days per review</td>
                                        <td className="py-4 px-6 text-zinc-400">Early issue detection & education</td>
                                    </tr>
                                    <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                                        <td className="py-4 px-6 font-medium">Bug Bounty Programs</td>
                                        <td className="py-4 px-6 text-zinc-400">Post-audit deployed projects</td>
                                        <td className="py-4 px-6 text-zinc-400">Ongoing</td>
                                        <td className="py-4 px-6 text-zinc-400">Community-powered security</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-zinc-400 mb-6">
                                Not sure which service is right for your project? Schedule a consultation with our team.
                            </p>
                            <motion.button
                                className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-lg font-medium"
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                            >
                                Book a Consultation
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
                        <p className="text-green-400 font-medium">Comprehensive security for the entire development lifecycle</p>
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
                            Contact Us Today
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
