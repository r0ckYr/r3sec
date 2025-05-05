"use client";

import { ArrowRight, Lock, EyeOff, Eye, ShieldCheck, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [invalidToken, setInvalidToken] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const urlToken = searchParams?.get("token");
        if (urlToken) {
            setToken(urlToken);
            // Verify token on page load
            verifyToken(urlToken);
        } else {
            setInvalidToken(true);
            setError("Reset token is missing. Please request a new password reset link.");
        }
    }, [searchParams]);

    const verifyToken = async (token) => {
        try {
            // Optional: You can verify the token on page load
            // This step is optional as the backend will verify it anyway when submitting
            // But it provides a better UX to show an error immediately if the token is invalid

            // Decode the JWT to check expiry without making an API call
            // This is just a frontend check, the backend will do a full verification
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                setInvalidToken(true);
                setError("Invalid reset token format. Please request a new password reset link.");
                return;
            }

            try {
                const payload = JSON.parse(atob(tokenParts[1]));
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    setInvalidToken(true);
                    setError("Your password reset link has expired. Please request a new one.");
                    return;
                }

                if (!payload.type || payload.type !== "password_reset") {
                    setInvalidToken(true);
                    setError("Invalid token type. Please request a new password reset link.");
                    return;
                }
            } catch (e) {
                setInvalidToken(true);
                setError("Could not verify the reset token. Please request a new password reset link.");
            }
        } catch (error) {
            setInvalidToken(true);
            setError("Could not verify the reset token. Please request a new password reset link.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validatePassword = (password) => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset state
        setError("");

        // Password validation
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    new_password: newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to reset password");
            }

            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);

        } catch (error) {
            console.error("Password reset error:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToHome = () => router.push('/');

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
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-green-800/20 to-green-500/10 blur-3xl opacity-30"></div>
                    <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-green-900/20 to-zinc-800/30 blur-3xl"></div>
                    <div className="absolute top-2/3 right-1/3 w-72 h-72 rounded-full bg-gradient-to-bl from-green-900/10 to-transparent blur-3xl"></div>
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

                        {/* Logo/Brand */}
                        <motion.div
                            variants={itemVariants}
                            className="flex justify-center mb-8 cursor-pointer relative z-10"
                            onClick={navigateToHome}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="flex flex-col items-center">
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
                                {invalidToken ? "Invalid Token" : (
                                    <>
                                        Reset Your
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
                                            Password
                                        </motion.span>
                                    </>
                                )}
                            </h2>
                            <p className="text-zinc-400 mt-2">
                                {invalidToken
                                    ? "There was a problem with your reset link"
                                    : "Create a new secure password"
                                }
                            </p>

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
                                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-red-400 flex-shrink-0" />
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
                                        <p className="font-medium text-green-300">Password updated successfully!</p>
                                        <p className="text-zinc-300">Redirecting you to the login page...</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Form */}
                        {!success && !invalidToken && (
                            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                {/* New Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-300">
                                        New Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-green-400 group-hover:text-green-500 transition-colors" />
                                        </div>
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={8}
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
                                    <p className="text-xs text-zinc-500">
                                        Password must be at least 8 characters long
                                    </p>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">
                                        Confirm New Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-green-400 group-hover:text-green-500 transition-colors" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="z-10 text-white block w-full pl-10 pr-10 py-3 border border-zinc-700 rounded-xl bg-zinc-800/50 focus:ring-green-500 focus:border-green-500 focus:bg-zinc-800 focus:outline-none text-sm transition-colors"
                                            placeholder="••••••••"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <motion.button
                                                type="button"
                                                onClick={toggleConfirmPasswordVisibility}
                                                className="text-green-400 hover:text-green-500 focus:outline-none"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                                        {isLoading ? "Updating Password..." : (
                                            <span className="flex items-center">Reset Password <ArrowRight className="ml-2 h-5 w-5" /></span>
                                        )}
                                    </span>
                                </motion.button>
                            </motion.form>
                        )}

                        {/* Show 'Request New Link' button if token is invalid */}
                        {invalidToken && (
                            <motion.div variants={itemVariants} className="flex justify-center mt-4">
                                <Link href="/auth/forgot-password">
                                    <motion.button
                                        className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-black px-6 py-3 rounded-xl flex items-center justify-center"
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: "0 10px 25px -5px rgba(74, 222, 128, 0.4)"
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Request New Reset Link
                                    </motion.button>
                                </Link>
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

export default ResetPassword;
