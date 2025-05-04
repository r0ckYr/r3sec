"use client";

import { ArrowRight, Mail, Lock, EyeOff, Eye, User, ShieldCheck, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/app/components/GoogleLoginButton";
import OrContinueWith from "@/app/components/OrContinueWith";
import { toast } from "react-hot-toast"; // Make sure to install react-hot-toast

const Register = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, username }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Show verification success message instead of redirecting
            setRegistrationSuccess(true);
            toast.success("Registration successful! Please check your email to verify your account.");

            // Clear the form
            setUsername("");
            setEmail("");
            setPassword("");
            setPasswordStrength(0);

        } catch (error: any) {
            console.error("Registration error:", error);
            setError(error.message || "Registration failed. Please try again.");
            toast.error(error.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        let strength = 0;
        if (newPassword.length >= 8) strength++;
        if (/[A-Z]/.test(newPassword)) strength++;
        if (/[0-9]/.test(newPassword)) strength++;
        if (/[^A-Za-z0-9]/.test(newPassword)) strength++;
        setPasswordStrength(strength);
    };

    const getStrengthColor = () => {
        return [
            "bg-zinc-700",
            "bg-red-500",
            "bg-yellow-500",
            "bg-blue-500",
            "bg-green-500"
        ][passwordStrength];
    };

    const navigateToHome = () => router.push('/');

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

    // Matrix-like digital rain animation
    const digitalRainAnimation = {
        y: [0, 100],
        opacity: [1, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "linear"
        }
    };

    // Cybersecurity-themed floating animation
    const floatingAnimation = {
        y: [-5, 5, -5],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    const handleGoogleAuthSuccess = (userData: any) => {
        // For Google auth, we redirect to profile page as verification is not needed
        router.push("/dashboard");
    };

    return (
        <div className="bg-black text-white min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                {/* Enhanced abstract background elements */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Main gradient blob */}
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-green-800/20 to-green-500/10 blur-3xl opacity-30"></div>

                    {/* Secondary gradient blobs */}
                    <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-green-900/20 to-zinc-800/30 blur-3xl"></div>
                    <div className="absolute top-2/3 right-1/3 w-72 h-72 rounded-full bg-gradient-to-bl from-green-900/10 to-transparent blur-3xl"></div>

                    {/* Animated elements - digital particles */}
                    <motion.div
                        className="absolute top-1/3 left-2/3 w-48 h-48 rounded-full bg-gradient-to-r from-green-800/20 to-green-500/10 blur-3xl"
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

                    {/* Digital matrix patterns */}
                    <div className="absolute inset-0 opacity-20">
                        {Array.from({ length: 20 }).map((_, index) => (
                            <motion.div
                                key={index}
                                className="absolute text-green-500 text-opacity-30 font-mono text-sm"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                }}
                                custom={index}
                                animate={digitalRainAnimation}
                            >
                                {Math.random() > 0.5 ? "0" : "1"}
                            </motion.div>
                        ))}
                    </div>

                    {/* Circuit board patterns */}
                    <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] bg-repeat opacity-5"></div>

                    {/* Light streaks */}
                    <motion.div
                        className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-b from-green-500/10 via-zinc-900/5 to-transparent rotate-12 blur-2xl"
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            rotate: [12, 15, 12]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-6 h-6">
                    <motion.div
                        className="absolute w-full h-full rounded-full border border-green-500/30"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                    />
                </div>
                <div className="absolute bottom-32 right-16">
                    <motion.div
                        className="text-green-400 opacity-70"
                        animate={floatingAnimation}
                    >
                        <ShieldCheck size={20} />
                    </motion.div>
                </div>
                <div className="absolute top-1/2 left-16">
                    <motion.div
                        className="h-20 w-1 bg-gradient-to-b from-green-500/0 via-green-500/50 to-green-500/0"
                        animate={{
                            height: ["80px", "120px", "80px"],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
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
                        {/* Glass reflection effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-zinc-900/5 backdrop-blur-sm z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

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

                        {/* Enhanced badge */}
                        <motion.div className="flex justify-center mb-6" variants={itemVariants}>
                            <motion.div
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-800 via-green-500 to-green-800 rounded-full text-sm font-medium text-black border border-green-400/20 shadow-lg relative overflow-hidden"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    boxShadow: [
                                        "0 5px 15px rgba(74, 222, 128, 0.2)",
                                        "0 8px 20px rgba(74, 222, 128, 0.4)",
                                        "0 5px 15px rgba(74, 222, 128, 0.2)"
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
                                <span>Create Secure Account</span>
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
                                Create
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
                                    Account
                                </motion.span>
                            </h2>
                            <p className="text-zinc-400 mt-2">Register to access secure services</p>

                            {/* Decorative line */}
                            <motion.div
                                className="h-1 w-16 bg-gradient-to-r from-green-600 to-green-400 rounded-full mt-4 mx-auto"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "4rem", opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            />
                        </motion.div>

                        {/* Show registration success message or the form */}
                        {registrationSuccess ? (
                            <motion.div
                                variants={itemVariants}
                                className="text-center p-6 bg-green-900/30 border border-green-800/70 rounded-xl shadow-sm mb-6"
                            >
                                <h3 className="text-lg font-semibold text-green-400 mb-2">
                                    Please Verify Your Email
                                </h3>
                                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                                    A verification link has been sent to your email address. Click the link in the email to confirm your account and complete the registration process.
                                </p>
                                <Link
                                    href="/auth/login"
                                    className="text-green-400 hover:text-green-300 font-medium hover:underline transition"
                                >
                                    Back to Login
                                </Link>
                            </motion.div>

                        ) : (
                            <>
                                {/* Error message display */}
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

                                <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                    {/* Username */}
                                    <div className="space-y-2">
                                        <label htmlFor="username" className="block text-sm font-medium text-zinc-300">Username</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-green-400 group-hover:text-green-500 transition-colors" />
                                            </div>
                                            <input
                                                id="username"
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                                className="z-10 text-white block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-xl bg-zinc-800/50 focus:ring-green-500 focus:border-green-500 focus:bg-zinc-800 focus:outline-none text-sm transition-colors"
                                                placeholder="johndoe"
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

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-green-400 group-hover:text-green-500 transition-colors" />
                                            </div>
                                            <input
                                                id="email"
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

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="block text-sm font-medium text-zinc-300">Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-green-400 group-hover:text-green-500 transition-colors" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={handlePasswordChange}
                                                required
                                                className="z-10 text-white block w-full pl-10 pr-10 py-3 border border-zinc-700 rounded-xl bg-zinc-800/50 focus:ring-green-500 focus:border-green-500 focus:bg-zinc-800 focus:outline-none text-sm transition-colors"
                                                placeholder="••••••••"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <motion.button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="text-green-400 hover:text-green-500 focus:outline-none"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </motion.button>
                                            </div>
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
                                        <div className="mt-2">
                                            <div className="h-1 w-full bg-zinc-700 rounded-full">
                                                <div className={`h-full ${getStrengthColor()}`} style={{ width: `${passwordStrength * 25}%` }} />
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-2">
                                                Use 8+ chars with uppercase, number & special char
                                            </p>
                                        </div>
                                    </div>

                                    {/* Terms */}
                                    <div className="flex items-start">
                                        <div className="relative">
                                            <input
                                                id="terms"
                                                type="checkbox"
                                                required
                                                className="h-4 w-4 text-green-500 focus:ring-green-500 border-zinc-600 bg-zinc-800 rounded mt-1"
                                            />
                                            <motion.div
                                                className="absolute inset-0 -m-1 bg-green-500/30 rounded-sm opacity-0"
                                                animate={{
                                                    opacity: [0, 0.2, 0],
                                                    scale: [0.8, 1.2, 0.8]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    repeatType: "loop"
                                                }}
                                            />
                                        </div>
                                        <label htmlFor="terms" className="ml-2 text-sm text-zinc-400">
                                            I agree to the{" "}
                                            <Link href="/terms" className="text-green-400 hover:text-green-300 hover:underline transition">Terms</Link> and{" "}
                                            <Link href="/privacy" className="text-green-400 hover:text-green-300 hover:underline transition">Privacy Policy</Link>
                                        </label>
                                    </div>

                                    {/* Register Button */}
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
                                            {isLoading ? "Creating Account..." : (
                                                <span className="flex items-center">Create Account <ArrowRight className="ml-2 h-5 w-5" /></span>
                                            )}
                                        </span>
                                    </motion.button>

                                    <div className="w-full max-w-full">
                                        <OrContinueWith textColor="text-zinc-400" lineColor="bg-zinc-700" />
                                        <GoogleLoginButton
                                            backendUrl={process.env.NEXT_PUBLIC_BACKEND_URL!}
                                            onAuthSuccess={handleGoogleAuthSuccess}
                                        />
                                    </div>
                                </motion.form>
                            </>
                        )}

                        {/* Already have account */}
                        <motion.div variants={itemVariants} className="text-center mt-8 relative z-10">
                            <p className="text-sm text-zinc-400">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="font-medium text-green-400 hover:text-green-300 hover:underline transition">
                                    Sign in
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
                                Enterprise-Grade Security • End-to-End Encryption
                            </motion.span>
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
