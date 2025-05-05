import React from "react";
import { motion } from "framer-motion";
import {
    Github,
    Twitter,
    Linkedin,
    Mail,
    ArrowRight,
    ShieldCheck,
    MessageSquare,
    ExternalLink
} from "lucide-react";

export default function Footer() {
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

    // Footer links sections
    const footerLinks = [
        {
            title: "Services",
            links: [
                { name: "Smart Contract Audits", href: "/pages/services#audits" },
                { name: "Security Monitoring", href: "/pages/services#monitoring" },
                { name: "Code Review", href: "/pages/services#code-review" },
                { name: "Bug Bounty Programs", href: "/pages/services#bug-bounty" }
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "Audit Reports", href: "/pages/resources#reports" },
                { name: "Security Blog", href: "/pages/resources#blog" },
                { name: "Documentation", href: "pages/resources#docs" },
                { name: "Common Vulnerabilities", href: "/pages/resources#vulnerabilities" }
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/pages/about" },
                { name: "Contact", href: "/pages/contact" }
            ]
        }
    ];

    // Social media links
    const socialLinks = [
        { name: "GitHub", icon: <Github size={20} />, href: "https://github.com/r0ckYr/r3sec" },
        { name: "Twitter", icon: <Twitter size={20} />, href: "https://x.com/r3sec_official" },
    ];

    return (
        <footer className="bg-zinc-950 border-t border-zinc-900 text-white">
            <motion.div
                className="container mx-auto px-4 py-12 md:py-16"
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, amount: 0.05 }}
            >

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                    {/* Brand Column */}
                    <motion.div
                        className="md:col-span-2"
                        variants={itemVariants}
                    >
                        <div className="mb-6">
                            <div className="flex items-center">
                                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg inline-block mr-3">
                                    <h2 className="text-2xl font-bold tracking-tighter">
                                        <span className="text-white">R3</span>
                                        <span className="text-green-400">SEC</span>
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <p className="text-zinc-400 mb-6 text-sm">
                            Securing the Solana ecosystem through expert smart contract audits,
                            continuous security monitoring, and vulnerability research.
                        </p>

                        <div className="flex space-x-4 mb-8">
                            {socialLinks.map((link, index) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-2 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    aria-label={link.name}
                                >
                                    {link.icon}
                                </motion.a>
                            ))}
                        </div>

                        <div className="flex items-center text-zinc-400 text-sm">
                            <Mail size={16} className="mr-2" />
                            <a href="mailto:support@r3sec.com" className="hover:text-green-400 transition-colors">
                                support@r3sec.com
                            </a>
                        </div>
                    </motion.div>

                    {/* Links Columns */}
                    {footerLinks.map((section, index) => (
                        <motion.div key={section.title} variants={itemVariants}>
                            <h3 className="font-semibold mb-5 text-lg">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-zinc-400 hover:text-green-400 transition-colors text-sm block py-1"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Bottom */}
                <motion.div
                    className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center"
                    variants={itemVariants}
                >
                    <div className="flex items-center mb-4 md:mb-0">
                        <ShieldCheck size={16} className="text-green-400 mr-2" />
                        <span className="text-zinc-500 text-sm">
                            Certified Solana Security Partner
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex flex-wrap gap-6 text-sm text-zinc-500 justify-center">
                            <a href="/pages/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
                            <a href="/pages/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
                        </div>
                        <span className="text-zinc-600 text-sm md:ml-6">© {new Date().getFullYear()} R3SEC. All rights reserved.</span>
                    </div>
                </motion.div>
            </motion.div>
        </footer>
    );
}
