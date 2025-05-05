import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Code, FileCheck, Clock, ArrowRight } from "lucide-react";

export default function Hero() {
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

    return (
        <div className="bg-black text-white">
            <motion.div
                className="container mx-auto px-4 py-16 md:py-24"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Hero Header */}
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
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                                <span className="text-white">R3</span>
                                <span className="text-green-400">SEC</span>
                            </h1>
                        </div>
                    </motion.div>

                    <motion.h2
                        className="text-2xl md:text-4xl font-semibold mb-6 tracking-tight"
                        variants={itemVariants}
                    >
                        Secure Your <span className="text-white border-b-2 border-green-400 pb-1">Solana</span> Smart Contracts
                    </motion.h2>

                    <motion.p
                        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed"
                        variants={itemVariants}
                    >
                        A comprehensive platform designed to help developers, DAOs, and Web3 projects
                        ensure the <span className="font-semibold text-white">security, stability, and trustworthiness</span> of
                        their Solana smart contracts.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap justify-center gap-6"
                        variants={itemVariants}
                    >
                        <motion.button
                            className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-lg font-medium text-lg group flex items-center"
                            variants={buttonVariants}
                            onClick={() => { window.location.href = '/auth/register' }}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Get Started
                            <motion.div
                                className="inline-block ml-2"
                                initial={{ x: 0 }}
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <ArrowRight size={18} />
                            </motion.div>
                        </motion.button>
                        <motion.button
                            className="bg-transparent border border-zinc-700 hover:border-green-500 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all"
                            variants={buttonVariants}
                            onClick={() => { window.location.href = '/pricing' }}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Learn More
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Featured Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto my-16">
                    <motion.div
                        className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 group cursor-pointer"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                    >
                        <motion.div
                            className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-green-500/10"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ShieldCheck className="h-8 w-8 text-green-400" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-4">Secure Audits</h3>
                        <p className="text-zinc-400">
                            Find trusted auditors for your Solana programs through our verified network. We match you with security experts who specialize in your specific smart contract needs.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 group cursor-pointer"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ delay: 0.1 }}
                    >
                        <motion.div
                            className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-green-500/10"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Code className="h-8 w-8 text-green-400" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-4">Streamlined Process</h3>
                        <p className="text-zinc-400">
                            Upload contracts via ZIP, GitHub, or Solana Program ID for quick audit submission. Our platform handles the complexity so you can focus on building.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 group cursor-pointer"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ delay: 0.2 }}
                    >
                        <motion.div
                            className="bg-zinc-800 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-green-500/10"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FileCheck className="h-8 w-8 text-green-400" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-4">Transparent Reports</h3>
                        <p className="text-zinc-400">
                            Access structured vulnerability reports with clear security recommendations. Each finding includes severity ratings and actionable remediation steps.
                        </p>
                    </motion.div>
                </div>


                {/* CTA Section */}
                <motion.div
                    className="max-w-4xl mx-auto text-center mt-20 mb-8"
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
                        <Clock className="h-6 w-6 text-green-400 mr-2" />
                        <p className="text-green-400 font-medium">Don't deploy without an audit</p>
                    </motion.div>

                    <motion.h3
                        className="text-2xl md:text-4xl font-bold mb-8"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        Ready to secure your Solana smart contracts?
                    </motion.h3>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <motion.button
                            className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-lg font-medium text-lg inline-flex items-center"
                            variants={buttonVariants}
                            onClick={() => { window.location.href = '/auth/register' }}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Schedule Your Audit Today
                            <motion.div
                                className="ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <ArrowRight size={18} />
                            </motion.div>
                        </motion.button>
                    </motion.div>

                    <motion.div
                        className="mt-16 pt-8 border-t border-zinc-800 text-zinc-500 text-sm"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        Trusted by leading Solana protocols and DAOs
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
