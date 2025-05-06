"use client";

import { ArrowRight, Mail, Lock, EyeOff, Eye, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Save admin data and token in local storage
            localStorage.setItem("adminAuthToken", data.token);
            localStorage.setItem("admin", JSON.stringify(data.admin));

            router.push("/contracts"); // Redirect after successful login
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
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
                {/* Background elements */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Main gradient blob */}
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-blue-800/20 to-blue-500/10 blur-3xl opacity-30"></div>

                    {/* Secondary gradient blobs */}
                    <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-900/20 to-zinc-800/30 blur-3xl"></div>

                    {/* Animated elements */}
                    <motion.div
                        className="absolute top-1/3 left-2/3 w-48 h-48 rounded-full bg-gradient-to-r from-blue-800/20 to-blue-500/10 blur-3xl"
                        animate={{
                            y: [-20, 20, -20],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

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
                            className="absolute inset-0 rounded-2xl border border-blue-500/20 z-0"
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(59, 130, 246, 0.1)",
                                    "0 0 40px rgba(59, 130, 246, 0.2)",
                                    "0 0 20px rgba(59, 130, 246, 0.1)"
                                ]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        />

                        {/* Logo/Brand */}
                        <motion.div
                            variants={itemVariants}
                            className="flex justify-center mb-8 relative z-10"
                        >
                            <div className="flex flex-col items-center">
                                {/* Logo */}
                                <motion.div
                                    className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl"
                                    initial={{ y: 0 }}
                                    animate={{
                                        y: [0, -5, 0],
                                        filter: [
                                            "drop-shadow(0 0 0px rgba(59, 130, 246, 0.3))",
                                            "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))",
                                            "drop-shadow(0 0 0px rgba(59, 130, 246, 0.3))"
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
                                        <span className="text-blue-400">SEC</span>
                                        <span className="text-xs text-zinc-500 ml-1">admin</span>
                                    </h1>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Admin badge */}
                        <motion.div className="flex justify-center mb-6" variants={itemVariants}>
                            <motion.div
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 rounded-full text-sm font-medium text-black border border-blue-400/20 shadow-lg relative overflow-hidden"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    boxShadow: [
                                        "0 5px 15px rgba(59, 130, 246, 0.2)",
                                        "0 8px 20px rgba(59, 130, 246, 0.4)",
                                        "0 5px 15px rgba(59, 130, 246, 0.2)"
                                    ]
                                }}
                                transition={{
                                    delay: 0.2,
                                    duration: 0.6,
                                    boxShadow: {
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }
                                }}
                            >
                                <ShieldCheck className="h-3 w-3 mr-2" />
                                <span>Admin Portal</span>
                                {/* Badge shine effect */}
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
                            </motion.div>
                        </motion.div>

                        {/* Title */}
                        <motion.div variants={itemVariants} className="text-center mb-8 relative z-10">
                            <h2 className="text-3xl text-white font-semibold">
                                Admin
                                <motion.span
                                    className="text-blue-400 ml-2"
                                    initial={{ textShadow: "0 0 0 rgba(59,130,246,0)" }}
                                    animate={{
                                        textShadow: [
                                            "0 0 10px rgba(59,130,246,0.3)",
                                            "0 0 20px rgba(59,130,246,0.5)",
                                            "0 0 10px rgba(59,130,246,0.3)"
                                        ]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    Access
                                </motion.span>
                            </h2>
                            <p className="text-zinc-400 mt-2">Sign in to manage secure services</p>

                            {/* Decorative line */}
                            <motion.div
                                className="h-1 w-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mt-4 mx-auto"
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

                        {/* Form */}
                        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                                    Admin Email
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-blue-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="z-10 text-white block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-xl bg-zinc-800/50 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800 focus:outline-none text-sm transition-colors"
                                        placeholder="admin@r3sec.xyz"
                                    />
                                    <motion.div
                                        className="absolute z-0 pointer-events-none inset-0 border border-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100"
                                        animate={{
                                            boxShadow: [
                                                "0 0 0px rgba(59, 130, 246, 0)",
                                                "0 0 10px rgba(59, 130, 246, 0.2)",
                                                "0 0 0px rgba(59, 130, 246, 0)"
                                            ]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-blue-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="z-10 text-white block w-full pl-10 pr-10 py-3 border border-zinc-700 rounded-xl bg-zinc-800/50 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800 focus:outline-none text-sm transition-colors"
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <motion.button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="text-blue-400 hover:text-blue-500 focus:outline-none"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </motion.button>
                                    </div>
                                    <motion.div
                                        className="absolute z-0 pointer-events-none inset-0 border border-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100"
                                        animate={{
                                            boxShadow: [
                                                "0 0 0px rgba(59, 130, 246, 0)",
                                                "0 0 10px rgba(59, 130, 246, 0.2)",
                                                "0 0 0px rgba(59, 130, 246, 0)"
                                            ]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Login Button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white px-4 py-4 rounded-xl flex items-center justify-center relative overflow-hidden group"
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
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
                                    {isLoading ? "Authenticating..." : (
                                        <span className="flex items-center">Admin Login <ArrowRight className="ml-2 h-5 w-5" /></span>
                                    )}
                                </span>
                            </motion.button>
                        </motion.form>
                    </motion.div>

                    {/* Security Notice */}
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
                            <ShieldCheck className="h-3 w-3 mr-1 text-blue-500" />
                            <motion.span
                                animate={{
                                    color: ["#71717a", "#3b82f6", "#71717a"]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                Restricted Access • Administrative Controls
                            </motion.span>
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;
