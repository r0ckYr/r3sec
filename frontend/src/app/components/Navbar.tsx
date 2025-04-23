import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Shield, ExternalLink } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Menu items with dropdowns
    const menuItems = [
        {
            name: "Products",
            dropdown: [
                { name: "Smart Contract Audits", href: "/audits" },
                { name: "Security Dashboard", href: "/dashboard" },
                { name: "Vulnerability Reports", href: "/reports" },
                { name: "Audit Marketplace", href: "/marketplace" }
            ]
        },
        {
            name: "Solutions",
            dropdown: [
                { name: "For Developers", href: "/developers" },
                { name: "For DAOs", href: "/daos" },
                { name: "For Enterprises", href: "/enterprise" },
                { name: "For Auditors", href: "/auditors" }
            ]
        },
        { name: "Pricing", href: "/pricing" },
        { name: "Resources", href: "/resources" },
        { name: "About", href: "/about" }
    ];

    const toggleDropdown = (index) => {
        if (activeDropdown === index) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(index);
        }
    };

    // Animation variants
    const navbarVariants = {
        initial: { opacity: 0, y: -20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: 10,
            transition: { duration: 0.2 }
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <>
            <motion.nav
                className={`fixed w-full z-50 ${scrolled
                    ? "bg-black border-b border-zinc-800 py-3"
                    : "bg-black backdrop-blur-sm py-5"
                    }`}
                initial="initial"
                animate="animate"
                variants={navbarVariants}
            >
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <motion.div
                            className="flex items-center"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <a href="/" className="flex items-center group">
                                <div className="relative">
                                    <motion.div
                                        className="absolute inset-0 bg-green-500/20 rounded-full"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                                    />
                                    <div className="bg-black rounded-full p-2 relative z-10 border border-zinc-800 group-hover:border-green-500/50 transition-colors duration-300">
                                        <Shield className="h-6 w-6 text-green-400" />
                                    </div>
                                </div>
                                <span className="ml-2 text-xl font-bold tracking-tight">
                                    <span className="text-white">R3</span>
                                    <span className="text-green-400">SEC</span>
                                </span>
                            </a>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            <ul className="flex space-x-1">
                                {menuItems.map((item, index) => (
                                    <li key={index} className="relative">
                                        {item.dropdown ? (
                                            <div>
                                                <motion.button
                                                    className="flex items-center px-3 py-2 text-zinc-300 hover:text-white text-sm font-medium transition-colors duration-200"
                                                    onClick={() => toggleDropdown(index)}
                                                    onMouseEnter={() => setActiveDropdown(index)}
                                                    onMouseLeave={() => setActiveDropdown(null)}
                                                >
                                                    {item.name}
                                                    <motion.span
                                                        animate={{ rotate: activeDropdown === index ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="ml-1"
                                                    >
                                                        <ChevronDown className="h-3.5 w-3.5" />
                                                    </motion.span>
                                                </motion.button>

                                                <AnimatePresence>
                                                    {activeDropdown === index && (
                                                        <motion.div
                                                            className="absolute left-0 mt-1 w-56 rounded-md shadow-lg overflow-hidden z-20"
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="hidden"
                                                            variants={dropdownVariants}
                                                            onMouseEnter={() => setActiveDropdown(index)}
                                                            onMouseLeave={() => setActiveDropdown(null)}
                                                        >
                                                            <div className="bg-black border border-zinc-800 rounded-md overflow-hidden relative">
                                                                <div className="absolute top-0 left-0 w-full h-0.5 bg-green-500/60" />
                                                                <ul className="py-1">
                                                                    {item.dropdown.map((dropdownItem, idx) => (
                                                                        <motion.li key={idx}
                                                                            whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                                                                        >
                                                                            <a
                                                                                href={dropdownItem.href}
                                                                                className="block px-4 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors duration-150"
                                                                            >
                                                                                {dropdownItem.name}
                                                                            </a>
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <motion.a
                                                href={item.href}
                                                className="block px-3 py-2 text-zinc-300 hover:text-white text-sm font-medium transition-colors duration-200"
                                                whileHover={{ color: "#ffffff" }}
                                            >
                                                {item.name}
                                            </motion.a>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            <div className="ml-6 flex items-center space-x-4">
                                <motion.a
                                    href="/auth/login"
                                    className="px-3 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors duration-200"
                                    whileHover={{ color: "#ffffff" }}
                                >
                                    Sign In
                                </motion.a>
                                <motion.a
                                    href="/signup"
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded-md text-sm font-medium flex items-center shadow-md shadow-green-900/20 transition-all duration-200"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Get Started
                                    <motion.span
                                        animate={{ x: [0, 3, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                        className="ml-1"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </motion.span>
                                </motion.a>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                                whileTap={{ scale: 0.92 }}
                            >
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="fixed inset-x-0 top-0 z-40 md:hidden bg-black border-b border-zinc-800"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={mobileMenuVariants}
                        >
                            <div className="flex flex-col h-screen pt-20 pb-6 px-4 overflow-y-auto">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-green-500/60" />

                                <div className="flex-1">
                                    <ul className="space-y-0.5">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                {item.dropdown ? (
                                                    <div>
                                                        <motion.button
                                                            className="flex items-center justify-between w-full px-4 py-3.5 text-white hover:bg-zinc-900 rounded-md text-base font-medium border-b border-zinc-900"
                                                            onClick={() => toggleDropdown(index)}
                                                            whileTap={{ scale: 0.99 }}
                                                        >
                                                            {item.name}
                                                            <motion.span
                                                                animate={{ rotate: activeDropdown === index ? 180 : 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <ChevronDown className="h-4 w-4" />
                                                            </motion.span>
                                                        </motion.button>

                                                        <AnimatePresence>
                                                            {activeDropdown === index && (
                                                                <motion.div
                                                                    className="mt-0.5 mb-2 bg-zinc-900/50 rounded-md"
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <ul className="py-1 pl-4">
                                                                        {item.dropdown.map((dropdownItem, idx) => (
                                                                            <motion.li key={idx}
                                                                                whileHover={{ x: 3 }}
                                                                                transition={{ duration: 0.1 }}
                                                                            >
                                                                                <a
                                                                                    href={dropdownItem.href}
                                                                                    className="block px-4 py-2.5 text-sm text-zinc-400 hover:text-white"
                                                                                >
                                                                                    {dropdownItem.name}
                                                                                </a>
                                                                            </motion.li>
                                                                        ))}
                                                                    </ul>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ) : (
                                                    <motion.a
                                                        href={item.href}
                                                        className="block px-4 py-3.5 text-white hover:bg-zinc-900 rounded-md text-base font-medium border-b border-zinc-900"
                                                        whileTap={{ scale: 0.99 }}
                                                    >
                                                        {item.name}
                                                    </motion.a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <motion.a
                                        href="/login"
                                        className="block w-full text-center px-4 py-3 text-white border border-zinc-800 hover:border-zinc-700 rounded-md text-base font-medium"
                                        whileHover={{ borderColor: "#3f3f46" }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Sign In
                                    </motion.a>
                                    <motion.a
                                        href="/signup"
                                        className="block w-full text-center px-4 py-3 bg-green-500 hover:bg-green-600 text-black rounded-md text-base font-medium shadow-lg shadow-green-900/20"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Get Started
                                    </motion.a>
                                </div>

                                {/* Close button */}
                                <div className="absolute top-4 right-4">
                                    <motion.button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                                        whileTap={{ scale: 0.92 }}
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Navbar spacer for fixed positioning */}
            <div className={`${scrolled ? "h-16" : "h-20"}`}></div>
        </>
    );
}
