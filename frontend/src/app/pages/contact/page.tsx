"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ContactUs() {
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

    // Form state
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        message: "",
        submitted: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you'd handle form submission to your backend here
        setFormState(prev => ({
            ...prev,
            submitted: true
        }));

        // Reset form after delay
        setTimeout(() => {
            setFormState({
                name: "",
                email: "",
                message: "",
                submitted: false
            });
        }, 3000);
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
                {/* Contact Header */}
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
                                Contact <span className="text-white">R3</span>
                                <span className="text-green-400">SEC</span>
                            </h1>
                        </div>
                    </motion.div>

                    <motion.p
                        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed"
                        variants={itemVariants}
                    >
                        Have questions about our smart contract auditing services? Get in touch with our team.
                    </motion.p>
                </motion.div>

                {/* Contact Section */}
                <motion.div
                    className="max-w-4xl mx-auto"
                    variants={itemVariants}
                >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {/* Contact Info */}
                        <motion.div
                            className="md:col-span-2"
                            variants={itemVariants}
                        >
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl h-full">
                                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

                                <div className="space-y-6">
                                    <motion.div
                                        className="flex items-start"
                                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                    >
                                        <div className="bg-zinc-800 rounded-full p-2 mr-4 flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">Email Us</h3>
                                            <a href="mailto:support@r3sec.xyz" className="text-green-400 hover:text-green-300 transition-colors">
                                                support@r3sec.xyz
                                            </a>
                                            <p className="text-zinc-400 text-sm mt-1">
                                                We'll respond within 24 hours
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="flex items-start"
                                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                    >
                                        <div className="bg-zinc-800 rounded-full p-2 mr-4 flex items-center justify-center">
                                            <MessageSquare className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">Schedule a Call</h3>
                                            <p className="text-zinc-400">
                                                Book a consultation with our security experts to discuss your project's needs
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="mt-12 pt-6 border-t border-zinc-800">
                                    <h3 className="text-lg font-medium mb-4">Emergency?</h3>
                                    <p className="text-zinc-400 mb-4">
                                        For urgent security incidents requiring immediate assistance:
                                    </p>
                                    <a
                                        href="mailto:urgent@r3sec.xyz"
                                        className="inline-flex items-center text-red-400 hover:text-red-300 font-medium"
                                    >
                                        urgent@r3sec.xyz
                                        <Send className="ml-2 h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            className="md:col-span-3"
                            variants={itemVariants}
                        >
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
                                {formState.submitted ? (
                                    <motion.div
                                        className="flex flex-col items-center justify-center text-center h-full py-12"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <CheckCircle className="h-16 w-16 text-green-400 mb-6" />
                                        <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                                        <p className="text-zinc-400 max-w-md">
                                            Thank you for reaching out. Our team will get back to you shortly.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formState.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formState.email}
                                                    onChange={handleChange}
                                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Message
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formState.message}
                                                    onChange={handleChange}
                                                    rows="5"
                                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors"
                                                    required
                                                ></textarea>
                                            </div>

                                            <motion.button
                                                type="submit"
                                                className="w-full bg-green-500 hover:bg-green-600 text-black py-3 px-6 rounded-lg font-medium text-lg flex items-center justify-center"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                Send Message
                                                <Send className="ml-2 h-4 w-4" />
                                            </motion.button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    className="max-w-4xl mx-auto mt-24"
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
                            Frequently Asked <span className="text-green-400">Questions</span>
                        </h2>
                        <p className="text-zinc-400">
                            Quick answers to common questions about our services
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.div
                            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                            variants={itemVariants}
                            whileHover={{
                                y: -5,
                                boxShadow: "0 5px 20px rgba(0, 255, 128, 0.07)",
                                transition: { duration: 0.2 }
                            }}
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    How long does an audit typically take?
                                </h3>
                                <p className="text-zinc-400">
                                    Our standard audits take 1-2 weeks depending on complexity and codebase size.
                                    For urgent needs, we offer expedited audits with a 72-hour turnaround.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                            variants={itemVariants}
                            whileHover={{
                                y: -5,
                                boxShadow: "0 5px 20px rgba(0, 255, 128, 0.07)",
                                transition: { duration: 0.2 }
                            }}
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    What information do you need to provide a quote?
                                </h3>
                                <p className="text-zinc-400">
                                    To provide an accurate quote, we need your project scope, codebase size,
                                    deployment timeline, and any specific security concerns you may have.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
            <Footer />
        </div>
    );
}
