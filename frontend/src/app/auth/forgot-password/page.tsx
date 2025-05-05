"use client";

import { ArrowRight, Mail, RefreshCw, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send reset link");
            }

            setSuccess(true);
        } catch (error) {
            console.error("Forgot password error:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToHome = () => router.push('/');

    // Enhanced animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="bg-black text-white min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                {/* Abstract background elements */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Main gradient blob */}
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-green-800/20 to-green-500/10 blur-3xl opacity-30"></div>

                    {/* Secondary gradient blobs */}
                    <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-green-900/20 to-zinc-800/30 blur-3xl"></div>
                    <div className="absolute top-2/3 right-1/3 w-72 h-72 rounded-full bg-gradient-to-bl from-green-900/10 to-transparent blur-3xl"></div>

                    {/* Digital matrix patterns */}
                    <div className="absolute inset-0 opacity-10">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <motion.div
                                key={index}
                                className="absolute text-green-500 text-opacity-30 font-mono text-sm"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, 100],
                                    opacity: [1, 0],
                                    transition: {
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }
                                }}
                            >
                                {Math.random() > 0.5 ? "0" : "1"}
                            </motion.div>
                        ))}
                    </div>

                    {/* Circuit board patterns */}
                    <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] bg-repeat opacity-5"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md px-6 py-12 relative z-10"
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-zinc-900/90 backdrop-blur-sm rounded-2xl shadow-lg border border-zinc-800 p-8 relative overflow-hidden"
                    >
                        {/* Border glow */}
                        <motion.div
                            className="absolute inset-0 rounded-2xl border border-green-500/20 z-0"
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(74, 222, 128, 0.1)",
                                    "0 0 40px rgba(74, 222, 128, 0.2)",
                                    "0 0 20px rgba(74, 222, 128, 0.1)"
                                ]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        />

                        {/* Logo/Brand - Clickable with enhanced animation */}
                        <motion.div
                            variants={itemVariants}
                            className="flex justify-center mb-8 cursor-pointer relative z-10"
                            onClick={navigateToHome}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="flex flex-col items-center">
                                {/* Logo */}
                                <motion.div
                                    className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl"
                                    initial={{ y: 0 }}
                                    animate={{
                                        y: [0, -5, 0],
                                        filter: [
                                            "drop-shadow(0 0 0px rgba(74, 222, 128, 0.3))",
                                            "drop-shadow(0 0 10px rgba(74, 222, 128, 0.5))",
                                            "drop-shadow(0 0 0px rgba(74, 222, 128, 0.3))"
                                        ]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
                                        <span className="text-white">R3</span>
                                        <span className="text-green-400">SEC</span>
                                    </h1>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.div variants={itemVariants} className="text-center mb-8 relative z-10">
                            <h2 className="text-2xl text-white font-semibold">
                                Forgot Your
                                <motion.span
                                    className="text-green-400 ml-2"
                                    initial={{ textShadow: "0 0 0 rgba(74,222,128,0)" }}
                                    animate={{
                                        textShadow: [
                                            "0 0 10px rgba(74,222,128,0.3)",
                                            "0 0 20px rgba(74,222,128,0.5)",
                                            "0 0 10px rgba(74,222,128,0.3)"
                                        ]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    Password?
                                </motion.span>
                            </h2>
                            <p className="text-zinc-400 mt-2">Enter your email to receive a reset link</p>

                            {/* Decorative line */}
                            <motion.div
                                className="h-1 w-16 bg-gradient-to-r from-green-600 to-green-400 rounded-full mt-4 mx-auto"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "4rem", opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            />
                        </motion.div>

                        {/* Error Display */}
                        {error && (
                            <motion.div
                                variants={itemVariants}
                                className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-300 rounded-lg text-sm relative z-10"
                            >
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <div>{error}</div>
                                </div>
                            </motion.div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <motion.div
                                variants={itemVariants}
                                className="mb-4 p-4 bg-green-900/30 border border-green-800/70 rounded-lg text-sm relative z-10"
                            >
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-green-300">Reset link sent!</p>
                                        <p className="text-zinc-300">If an account exists with this email, you'll receive a password reset link shortly. Please check your inbox and spam folder.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Form */}
                        {!success ? (
                            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-green-400 group-hover:text-green-500 transition-colors" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="z-10 text-white block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-xl bg-zinc-800/50 focus:ring-green-500 focus:border-green-500 focus:bg-zinc-800 focus:outline-none text-sm transition-colors"
                                            placeholder="your.email@example.com"
                                        />
                                        <motion.div
                                            className="absolute z-0 pointer-events-none inset-0 border border-green-500/20 rounded-xl opacity-0 group-hover:opacity-100"
                                            animate={{
                                                boxShadow: [
                                                    "0 0 0px rgba(74, 222, 128, 0)",
                                                    "0 0 10px rgba(74, 222, 128, 0.2)",
                                                    "0 0 0px rgba(74, 222, 128, 0)"
                                                ]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-black px-4 py-4 rounded-xl flex items-center justify-center relative overflow-hidden group"
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: "0 10px 25px -5px rgba(74, 222, 128, 0.4)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Button shine effect */}
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                        animate={{
                                            x: ["-200%", "200%"],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatDelay: 3
                                        }}
                                    />
                                    {/* Button text */}
                                    <span className="relative z-10 font-medium">
                                        {isLoading ? (
                                            <span className="flex items-center">
                                                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">Send Reset Link <ArrowRight className="ml-2 h-5 w-5" /></span>
                                        )}
                                    </span>
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.div
                                variants={itemVariants}
                                className="flex justify-center mt-4"
                            >
                                <motion.button
                                    onClick={() => {
                                        setSuccess(false);
                                        setEmail("");
                                    }}
                                    className="bg-zinc-800 text-green-400 px-4 py-2 rounded-xl flex items-center justify-center relative overflow-hidden group"
                                    whileHover={{
                                        scale: 1.02,
                                        backgroundColor: "rgba(34, 197, 94, 0.2)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="relative z-10 font-medium flex items-center">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Try another email
                                    </span>
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Back to Login Link */}
                        <motion.div variants={itemVariants} className="text-center mt-8 relative z-10">
                            <p className="text-sm text-zinc-400">
                                Remember your password?{" "}
                                <Link href="/auth/login" className="font-medium text-green-400 hover:text-green-300 hover:underline transition">
                                    Back to login
                                </Link>
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Enhanced Security Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                        className="mt-6 text-center"
                    >
                        <motion.p
                            className="text-xs text-zinc-500 flex items-center justify-center"
                            animate={{
                                y: [0, -2, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        >
                            <ShieldCheck className="h-3 w-3 mr-1 text-green-500" />
                            <motion.span
                                animate={{
                                    color: ["#71717a", "#4ade80", "#71717a"]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                Secure Password Reset • End-to-End Encryption
                            </motion.span>
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
