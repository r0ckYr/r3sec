import React from "react";
import { motion } from "framer-motion";
import {
    Upload,
    Shield,
    FileSearch,
    CheckCircle,
    ArrowRight,
    Lock,
    User
} from "lucide-react";

export default function HowItWorks() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: custom * 0.2,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    const steps = [
        {
            icon: <Upload className="h-8 w-8" />,
            title: "Upload Your Contract",
            description: "Submit your Solana smart contract through our secure upload interface. We accept direct ZIP uploads, GitHub repositories, or existing Solana Program IDs."
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: "Security Audit",
            description: "Our network of verified security professionals rigorously audit your code, identifying vulnerabilities, logic issues, and potential exploits."
        },
        {
            icon: <FileSearch className="h-8 w-8" />,
            title: "Review Findings",
            description: "Access detailed reports with categorized findings and severity levels. Each vulnerability includes clear explanations and recommended fixes."
        },
        {
            icon: <CheckCircle className="h-8 w-8" />,
            title: "Deploy with Confidence",
            description: "Address identified issues and deploy your Solana smart contract with confidence, backed by R3SEC's comprehensive security verification."
        }
    ];

    return (
        <section className="bg-black text-white py-20 relative overflow-hidden">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                    {Array.from({ length: 36 }).map((_, i) => (
                        <div key={i} className="border-r border-b border-white/10"></div>
                    ))}
                </div>
            </div>

            {/* Green accent line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    className="max-w-4xl mx-auto mb-16 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <motion.p
                        className="text-green-400 font-medium mb-3"
                        variants={itemVariants}
                    >
                        Streamlined Security Process
                    </motion.p>
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-6"
                        variants={itemVariants}
                    >
                        How R3SEC Works
                    </motion.h2>
                    <motion.p
                        className="text-zinc-400 text-lg max-w-2xl mx-auto"
                        variants={itemVariants}
                    >
                        Our simple four-step process helps developers secure their Solana smart contracts with minimum friction and maximum confidence.
                    </motion.p>
                </motion.div>

                {/* Process Steps */}
                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute left-1/2 top-0 h-full w-0.5 bg-zinc-800 transform -translate-x-1/2"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 relative">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className={`relative ${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:pl-16 lg:mt-32'}`}
                                custom={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.4 }}
                                variants={stepVariants}
                            >
                                {/* Step Number (Large) */}
                                <div className="absolute left-0 top-0 opacity-5 text-8xl font-bold -z-10 select-none lg:left-auto lg:right-0">
                                    {index + 1}
                                </div>

                                {/* Connection Dot */}
                                <div className="hidden lg:block absolute top-8 w-5 h-5 rounded-full bg-black border-2 border-green-500 lg:left-auto lg:right-0">
                                    {index % 2 === 0 ? (
                                        <div className="absolute -right-[75px] top-1/2 w-16 h-0.5 bg-green-500/30 transform -translate-y-1/2"></div>
                                    ) : (
                                        <div className="absolute -left-[75px] top-1/2 w-16 h-0.5 bg-green-500/30 transform -translate-y-1/2"></div>
                                    )}
                                </div>

                                {/* Content Box */}
                                <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all shadow-lg shadow-black/50 h-full">
                                    <div className={`flex items-center ${index % 2 === 0 ? 'lg:justify-end' : ''} mb-4`}>
                                        <div className="bg-green-500/10 p-3 rounded-lg mr-3 lg:mr-3">
                                            <motion.div
                                                className="text-green-400"
                                                whileHover={{ rotate: 5, scale: 1.1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {step.icon}
                                            </motion.div>
                                        </div>
                                        <span className="text-xl font-semibold">{step.title}</span>
                                    </div>
                                    <p className="text-zinc-400">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Step Number (Indicator) */}
                                <div className="absolute -top-3 -left-3 bg-black text-green-400 border border-green-500/30 h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium shadow-lg lg:left-auto lg:right-0">
                                    {index + 1}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Integration Info */}
                <motion.div
                    className="mt-20 max-w-4xl mx-auto bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="bg-zinc-900 p-8 border-b md:border-b-0 md:border-r border-zinc-800">
                            <div className="bg-green-500/10 p-3 rounded-lg inline-block mb-4">
                                <Lock className="h-6 w-6 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Developer Friendly</h3>
                            <p className="text-zinc-400 text-sm">
                                Simple API integration with your existing development workflow
                            </p>
                        </div>

                        <div className="bg-zinc-800/50 p-8 border-b md:border-b-0 md:border-r border-zinc-800">
                            <div className="bg-green-500/10 p-3 rounded-lg inline-block mb-4">
                                <User className="h-6 w-6 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Verified Auditors</h3>
                            <p className="text-zinc-400 text-sm">
                                Access to our network of security professionals specialized in Solana
                            </p>
                        </div>

                        <div className="bg-zinc-900 p-8">
                            <div className="bg-green-500/10 p-3 rounded-lg inline-block mb-4">
                                <Shield className="h-6 w-6 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Complete Security</h3>
                            <p className="text-zinc-400 text-sm">
                                End-to-end encryption and privacy for your intellectual property
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <motion.a
                        href="/demo"
                        className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-black rounded-lg font-medium transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        See how it works
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="ml-2"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </motion.span>
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
