"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    Shield,
    ArrowRight,
    Github,
    AlertCircle
} from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
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

    // Particle effect data
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        setIsLoading(true);
        setError("");

        // Simulate login process
        setTimeout(() => {
            setIsLoading(false);
            // Redirect or show success would happen here in a real app
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full bg-green-500 opacity-10"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl mx-auto">
                {/* Left column - Brand section */}
                <motion.div
                    className="w-full md:w-5/12 bg-zinc-900 p-8 md:p-12 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border-b md:border-b-0 md:border-r border-zinc-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="h-full flex flex-col">
                        <div className="mb-8">
                            <motion.div
                                className="bg-zinc-950 inline-block p-3 rounded-xl border border-zinc-800 mb-6"
                                whileHover={{ rotate: 5, scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="text-3xl font-bold tracking-tighter">
                                    <span className="text-white">R3</span>
                                    <span className="text-green-400">SEC</span>
                                </h1>
                            </motion.div>

                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Welcome Back, <br />
                                Security Expert
                            </h2>
                            <p className="text-zinc-400 mb-6">
                                Log in to access your dashboard and secure the Solana ecosystem.
                            </p>
                        </div>

                        <div className="mt-auto">
                            <div className="bg-zinc-950/50 rounded-xl p-5 border border-zinc-800">
                                <div className="flex items-start mb-4">
                                    <div className="mr-4 mt-1">
                                        <div className="bg-green-500/10 p-2 rounded-full">
                                            <Shield size={18} className="text-green-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white mb-1">Protect Your Projects</h3>
                                        <p className="text-zinc-400 text-sm">Access your audit dashboard, track vulnerabilities, and secure your smart contracts.</p>
                                    </div>
                                </div>

                                <motion.div
                                    className="h-1 bg-gradient-to-r from-green-600 to-green-400"
                                    initial={{ scaleX: 0, originX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                                />
                            </div>

                            <div className="text-center mt-8 text-sm text-zinc-500">
                                New to R3SEC? <a href="/register" className="text-green-400 hover:underline">Create an account</a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right column - Login form */}
                <motion.div
                    className="w-full md:w-7/12 bg-black p-8 md:p-12 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
                            <p className="text-zinc-400">Enter your credentials to access your account</p>
                        </motion.div>

                        {error && (
                            <motion.div
                                className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center text-sm"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <AlertCircle size={16} className="text-red-500 mr-2 flex-shrink-0" />
                                <span className="text-red-200">{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <motion.div variants={itemVariants} className="mb-5">
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-zinc-500" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-zinc-900 border border-zinc-800 text-white rounded-lg block w-full pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                                        Password
                                    </label>
                                    <a href="/forgot-password" className="text-sm text-green-400 hover:text-green-300">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-zinc-500" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-zinc-900 border border-zinc-800 text-white rounded-lg block w-full pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-zinc-500 hover:text-zinc-300 focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center mb-6">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded bg-zinc-900 border-zinc-700 text-green-500 focus:ring-green-500 focus:ring-offset-zinc-900"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
                                    Remember me for 30 days
                                </label>
                            </motion.div>

                            <motion.div variants={itemVariants} className="mb-6">
                                <motion.button
                                    type="submit"
                                    className="w-full flex justify-center items-center bg-green-500 hover:bg-green-600 text-black py-3 px-4 rounded-lg font-medium transition-colors relative overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                >
                                    {isLoading && (
                                        <motion.div
                                            className="absolute inset-0 bg-green-600"
                                            initial={{ scaleX: 0, originX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 1.5, ease: "linear" }}
                                        />
                                    )}
                                    <span className="relative flex items-center">
                                        {isLoading ? "Signing in..." : "Sign in"}
                                        {!isLoading && (
                                            <ArrowRight size={16} className="ml-2" />
                                        )}
                                    </span>
                                </motion.button>
                            </motion.div>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-800"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-black text-zinc-500">Or continue with</span>
                                </div>
                            </div>

                            <motion.div variants={itemVariants}>
                                <button
                                    type="button"
                                    className="w-full flex justify-center items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white py-3 px-4 rounded-lg font-medium mb-4 transition-colors"
                                >
                                    <Github size={18} className="mr-2" />
                                    GitHub
                                </button>
                            </motion.div>
                        </form>
                    </motion.div>

                    <motion.div
                        className="mt-8 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        By signing in, you agree to our{' '}
                        <a href="/terms" className="text-zinc-400 hover:underline">Terms of Service</a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-zinc-400 hover:underline">Privacy Policy</a>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
