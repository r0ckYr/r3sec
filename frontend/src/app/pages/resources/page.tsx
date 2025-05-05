"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Book, BookOpen, AlertTriangle, ArrowRight, ExternalLink, Calendar, Tag, Download } from "lucide-react";

export default function Resources() {
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

    // Sample data for resources
    const auditReports = [
        {
            title: "Jupiter Exchange Swap Router",
            date: "April 2025",
            description: "Security assessment of Jupiter's cross-chain swap router, focusing on smart contract vulnerabilities and transaction security.",
            severity: "Medium",
            link: "#"
        },
        {
            title: "Solana Lending Protocol",
            date: "March 2025",
            description: "Comprehensive audit of a major DeFi lending protocol, examining collateralization mechanisms and liquidation processes.",
            severity: "Critical",
            link: "#"
        },
        {
            title: "NFT Marketplace Smart Contract",
            date: "February 2025",
            description: "Technical review of NFT marketplace contracts, including royalty enforcement and escrow systems.",
            severity: "Low",
            link: "#"
        }
    ];

    const blogPosts = [
        {
            title: "Common Pitfalls in Solana Program Development",
            date: "April 15, 2025",
            description: "Exploring the most frequent security issues we encounter during Solana program audits and how to avoid them.",
            tags: ["Development", "Best Practices"],
            link: "#"
        },
        {
            title: "Attack Vectors in Cross-Program Invocation",
            date: "March 22, 2025",
            description: "How attackers can exploit cross-program invocation vulnerabilities and the security measures needed to protect against them.",
            tags: ["Security", "Advanced"],
            link: "#"
        },
        {
            title: "Understanding Transaction Simulation for Security Testing",
            date: "February 8, 2025",
            description: "Leveraging transaction simulation as a powerful tool for identifying vulnerabilities before deployment.",
            tags: ["Testing", "Tools"],
            link: "#"
        }
    ];

    const documentation = [
        {
            title: "Secure Development Guide",
            description: "Step-by-step guide to integrating security practices throughout the development lifecycle for Solana programs.",
            link: "#"
        },
        {
            title: "Audit Preparation Checklist",
            description: "Comprehensive checklist to prepare your codebase for a successful security audit.",
            link: "#"
        },
        {
            title: "Technical Architecture Reviews",
            description: "Framework for conducting system-wide architecture reviews to identify security concerns beyond the code level.",
            link: "#"
        },
        {
            title: "Post-Audit Implementation Guide",
            description: "Best practices for implementing audit recommendations and maintaining security post-audit.",
            link: "#"
        }
    ];

    const vulnerabilities = [
        {
            name: "Account Data Confusion",
            risk: "Critical",
            description: "Occurs when a program fails to validate that the account it's operating on contains the expected type of data.",
            example: "A program expects Account A but receives Account B, potentially leading to unauthorized access."
        },
        {
            name: "Improper PDA Validation",
            risk: "High",
            description: "Program-derived addresses (PDAs) are not properly validated, allowing attackers to provide malicious seeds.",
            example: "Missing checks on PDA derivation can lead to unauthorized account creation or access."
        },
        {
            name: "Instruction Snooping",
            risk: "Medium",
            description: "Attackers can extract sensitive information by examining transaction instructions before they're processed.",
            example: "Front-running attacks where malicious actors exploit knowledge of pending transactions."
        },
        {
            name: "Missing Ownership Checks",
            risk: "High",
            description: "Programs that fail to verify account ownership, allowing unauthorized modifications.",
            example: "An attacker provides a look-alike account they control instead of the expected system account."
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
            <motion.div
                className="container mx-auto px-4 py-16 md:py-24"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Resources Header */}
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
                                <span className="text-green-400">SEC</span> Resources
                            </h1>
                        </div>
                    </motion.div>

                    <motion.p
                        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed"
                        variants={itemVariants}
                    >
                        Browse our collection of resources to help you build more secure Solana smart contracts.
                    </motion.p>
                </motion.div>

                {/* Quick Navigation */}
                <motion.div
                    className="max-w-4xl mx-auto mb-16"
                    variants={itemVariants}
                >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6">Quick Navigation</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <motion.a
                                href="#audit-reports"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('audit-reports');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <FileText className="h-5 w-5 text-green-400 mr-3" />
                                <span>Audit Reports</span>
                            </motion.a>

                            <motion.a
                                href="#security-blog"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('security-blog');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <Book className="h-5 w-5 text-green-400 mr-3" />
                                <span>Security Blog</span>
                            </motion.a>

                            <motion.a
                                href="#documentation"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('documentation');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <BookOpen className="h-5 w-5 text-green-400 mr-3" />
                                <span>Documentation</span>
                            </motion.a>

                            <motion.a
                                href="#common-vulnerabilities"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('common-vulnerabilities');
                                }}
                                className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                            >
                                <AlertTriangle className="h-5 w-5 text-green-400 mr-3" />
                                <span>Vulnerabilities</span>
                            </motion.a>
                        </div>
                    </div>
                </motion.div>

                {/* Audit Reports Section */}
                <section id="audit-reports" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <FileText className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Audit Reports</h2>
                        </div>

                        <p className="text-zinc-400 mb-8">
                            Browse our public audit reports to understand common vulnerabilities and see our audit methodology in action.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {auditReports.map((report, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    whileHover="hover"
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-semibold">
                                                {report.title}
                                            </h3>
                                            <div className={`
                                                px-3 py-1 rounded-full text-xs font-medium
                                                ${report.severity === 'Critical' ? 'bg-red-900/30 text-red-400' :
                                                    report.severity === 'High' ? 'bg-orange-900/30 text-orange-400' :
                                                        report.severity === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                                                            'bg-blue-900/30 text-blue-400'}
                                            `}>
                                                {report.severity} Risk
                                            </div>
                                        </div>
                                        <div className="flex items-center text-zinc-500 text-sm mb-4">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {report.date}
                                        </div>
                                        <p className="text-zinc-400 mb-6">
                                            {report.description}
                                        </p>
                                        <a
                                            href={report.link}
                                            className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                                        >
                                            View Full Report
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}

                            <motion.div
                                className="bg-zinc-900/30 border border-zinc-800 border-dashed rounded-xl overflow-hidden col-span-1 md:col-span-2"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="p-6 flex flex-col md:flex-row items-center justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <h3 className="text-xl font-semibold mb-2">
                                            Looking for Private Audit Reports?
                                        </h3>
                                        <p className="text-zinc-400">
                                            Clients with active engagements can access their private audit reports through our secure portal.
                                        </p>
                                    </div>
                                    <motion.button
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-medium"
                                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                    >
                                        Client Portal
                                        <ArrowRight className="inline-block ml-2 h-4 w-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Security Blog Section */}
                <section id="security-blog" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <Book className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Security Blog</h2>
                        </div>

                        <p className="text-zinc-400 mb-8">
                            Insights, analysis, and technical deep-dives from our security research team.
                        </p>

                        <div className="space-y-6">
                            {blogPosts.map((post, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    whileHover="hover"
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-3">
                                            {post.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center text-zinc-500 text-sm mb-4">
                                            <div className="flex items-center mr-4">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {post.date}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Tag className="h-4 w-4" />
                                                {post.tags.map((tag, i) => (
                                                    <span key={i} className="bg-zinc-800 px-2 py-1 rounded text-xs">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-zinc-400 mb-6">
                                            {post.description}
                                        </p>
                                        <a
                                            href={post.link}
                                            className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                                        >
                                            Read More
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}

                            <motion.div
                                className="text-center py-8"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <motion.button
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-lg font-medium"
                                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                >
                                    View All Blog Posts
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Documentation Section */}
                <section id="documentation" className="pt-10 mb-24">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <BookOpen className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Documentation</h2>
                        </div>

                        <p className="text-zinc-400 mb-8">
                            Comprehensive guides and resources to help you implement security best practices in your Solana projects.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {documentation.map((doc, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    whileHover="hover"
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-4">
                                            {doc.title}
                                        </h3>
                                        <p className="text-zinc-400 mb-6">
                                            {doc.description}
                                        </p>
                                        <div className="flex space-x-3">
                                            <a
                                                href={doc.link}
                                                className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                                            >
                                                Read Online
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </a>
                                            <a
                                                href={doc.link}
                                                className="inline-flex items-center text-zinc-400 hover:text-zinc-300 transition-colors"
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                PDF
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Common Vulnerabilities Section */}
                <section id="common-vulnerabilities" className="pt-10 mb-20">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="flex items-center mb-8">
                            <AlertTriangle className="h-8 w-8 text-green-400 mr-4" />
                            <h2 className="text-3xl font-bold">Common Vulnerabilities</h2>
                        </div>

                        <p className="text-zinc-400 mb-8">
                            Learn about the most common security issues we find in Solana smart contracts and how to avoid them in your code.
                        </p>

                        <div className="space-y-6">
                            {vulnerabilities.map((vuln, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold">
                                                {vuln.name}
                                            </h3>
                                            <div className={`
                                                px-3 py-1 rounded-full text-xs font-medium
                                                ${vuln.risk === 'Critical' ? 'bg-red-900/30 text-red-400' :
                                                    vuln.risk === 'High' ? 'bg-orange-900/30 text-orange-400' :
                                                        vuln.risk === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                                                            'bg-blue-900/30 text-blue-400'}
                                            `}>
                                                {vuln.risk} Risk
                                            </div>
                                        </div>
                                        <p className="text-zinc-400 mb-4">
                                            {vuln.description}
                                        </p>
                                        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
                                            <div className="text-sm text-zinc-500 mb-2">Example:</div>
                                            <p className="text-zinc-400 text-sm">
                                                {vuln.example}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            <motion.div
                                className="bg-zinc-900/30 border border-zinc-800 border-dashed rounded-xl overflow-hidden"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-semibold mb-4">
                                        Want our complete vulnerability database?
                                    </h3>
                                    <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
                                        Access our comprehensive vulnerability knowledge base with detailed examples, prevention strategies, and remediation techniques.
                                    </p>
                                    <motion.button
                                        className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-lg font-medium"
                                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                                    >
                                        Request Full Access
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Newsletter Signup */}
                <motion.div
                    className="max-w-4xl mx-auto text-center mt-24"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h3
                        className="text-2xl md:text-3xl font-bold mb-6"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Stay Updated on Solana Security
                    </motion.h3>

                    <motion.p
                        className="text-zinc-400 mb-8 max-w-2xl mx-auto"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Subscribe to our newsletter for the latest security advisories, research, and best practices.
                    </motion.p>

                    <motion.div
                        className="flex flex-col md:flex-row gap-4 justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white w-full md:w-80 focus:border-green-400 focus:outline-none"
                        />
                        <motion.button
                            className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium"
                            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                        >
                            Subscribe
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
