"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Award, Globe, Target, Building, Star } from "lucide-react";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function AboutUs() {
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

    const staggerChildrenVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    // Team members data
    const teamMembers = [
        {
            name: "Alex Rivera",
            role: "Founder & CEO",
            bio: "Former security lead at a top Solana validator with 8+ years in blockchain security and cryptography.",
            icon: ShieldCheck
        },
        {
            name: "Maya Chen",
            role: "Lead Security Researcher",
            bio: "Smart contract auditor who has identified critical vulnerabilities in major DeFi protocols.",
            icon: Target
        },
        {
            name: "Raj Patel",
            role: "Head of Audit Operations",
            bio: "Managed security audits for over 50 Web3 projects with expertise in Rust and the Solana ecosystem.",
            icon: Building
        },
    ];

    return (
        <div className="bg-black text-white">
            <Navbar />
            <motion.div
                className="container mx-auto px-4 py-16 md:py-24"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* About Header */}
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
                                About <span className="text-white">R3</span>
                                <span className="text-green-400">SEC</span>
                            </h1>
                        </div>
                    </motion.div>

                    <motion.p
                        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed"
                        variants={itemVariants}
                    >
                        We are a team of blockchain security experts dedicated to protecting the Solana ecosystem
                        through rigorous smart contract audits, vulnerability assessments, and security best practices.
                    </motion.p>
                </motion.div>

                {/* Our Mission Section */}
                <motion.div
                    className="max-w-5xl mx-auto mb-24"
                    variants={itemVariants}
                >
                    <motion.div
                        className="flex flex-col md:flex-row gap-8 items-center"
                        variants={staggerChildrenVariants}
                    >
                        <motion.div
                            className="md:w-1/2"
                            variants={itemVariants}
                        >
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
                                <div className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                                    <Target className="h-8 w-8 text-green-400" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
                                <p className="text-zinc-400 mb-4">
                                    At R3SEC, our mission is to strengthen the foundation of the Solana ecosystem by establishing
                                    the highest security standards for smart contracts and decentralized applications.
                                </p>
                                <p className="text-zinc-400">
                                    We believe that security is fundamental to the long-term success of Web3, and we're committed
                                    to protecting both developers and users by identifying vulnerabilities before they can be exploited.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="md:w-1/2"
                            variants={itemVariants}
                        >
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
                                <div className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6">
                                    <Award className="h-8 w-8 text-green-400" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Values</h2>
                                <ul className="text-zinc-400 space-y-4">
                                    <li className="flex items-start">
                                        <span className="text-green-400 mr-2">•</span>
                                        <span>Rigorous standards and methodical approach to security auditing</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-400 mr-2">•</span>
                                        <span>Transparency in our processes and findings</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-400 mr-2">•</span>
                                        <span>Collaboration with developers to build more secure systems</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-400 mr-2">•</span>
                                        <span>Continuous learning in an evolving security landscape</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Our Expertise */}
                <motion.div
                    className="max-w-5xl mx-auto mb-24"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center mb-12"
                        variants={itemVariants}
                    >
                        Our <span className="text-green-400">Expertise</span>
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 group cursor-pointer"
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <motion.div
                                className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-green-500/10"
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ShieldCheck className="h-8 w-8 text-green-400" />
                            </motion.div>
                            <h3 className="text-xl font-semibold mb-4">Smart Contract Audits</h3>
                            <p className="text-zinc-400">
                                Our deep expertise in Solana's architecture and Rust programming enables us to identify
                                vulnerabilities in smart contract code that others might miss.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 group cursor-pointer"
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: 0.1 }}
                        >
                            <motion.div
                                className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-green-500/10"
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Globe className="h-8 w-8 text-green-400" />
                            </motion.div>
                            <h3 className="text-xl font-semibold mb-4">DeFi Protocol Security</h3>
                            <p className="text-zinc-400">
                                Specialized knowledge in securing decentralized exchanges, lending platforms, and other
                                financial protocols where security breaches can have catastrophic consequences.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 group cursor-pointer"
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-green-500/10"
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Star className="h-8 w-8 text-green-400" />
                            </motion.div>
                            <h3 className="text-xl font-semibold mb-4">Security Consulting</h3>
                            <p className="text-zinc-400">
                                Beyond audits, we provide ongoing security guidance, helping teams implement security-first
                                development practices and respond to emerging threats.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Our Team */}
                <motion.div
                    className="max-w-5xl mx-auto mb-24"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div className="text-center mb-12">
                        <motion.div
                            className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6 mx-auto"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Users className="h-8 w-8 text-green-400" />
                        </motion.div>

                        <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-6"
                            variants={itemVariants}
                        >
                            Meet Our <span className="text-green-400">Team</span>
                        </motion.h2>

                        <motion.p
                            className="text-lg text-zinc-400 max-w-3xl mx-auto"
                            variants={itemVariants}
                        >
                            Our team consists of blockchain security experts, Rust developers,
                            and cryptography specialists with years of experience securing Web3 applications.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerChildrenVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 text-center"
                                variants={itemVariants}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <div className="w-24 h-24 bg-zinc-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                                    <div className="text-2xl font-bold text-green-400">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                                <p className="text-green-400 text-sm mb-4">{member.role}</p>
                                <p className="text-zinc-400 text-sm">{member.bio}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Track Record */}
                <motion.div
                    className="max-w-5xl mx-auto mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div
                        className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-12 rounded-2xl"
                        whileHover={{
                            boxShadow: "0 0 50px rgba(0, 255, 128, 0.05)",
                            transition: { duration: 0.5 }
                        }}
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Track Record</h2>
                            <p className="text-zinc-400 max-w-3xl mx-auto">
                                Since our founding, we've helped secure billions in TVL and prevented
                                numerous critical vulnerabilities from reaching production.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-4xl md:text-5xl font-bold text-green-400 mb-2">100+</h3>
                                <p className="text-zinc-400">Audits Completed</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-4xl md:text-5xl font-bold text-green-400 mb-2">$3B+</h3>
                                <p className="text-zinc-400">TVL Protected</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-4xl md:text-5xl font-bold text-green-400 mb-2">50+</h3>
                                <p className="text-zinc-400">Critical Findings</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-4xl md:text-5xl font-bold text-green-400 mb-2">24h</h3>
                                <p className="text-zinc-400">Emergency Response</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Join Us CTA */}
                <motion.div
                    className="max-w-4xl mx-auto text-center mt-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h3
                        className="text-2xl md:text-3xl font-bold mb-8"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Ready to work with the best in Solana security?
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
                            Contact Our Team
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
            <Footer />
        </div>
    );
}
