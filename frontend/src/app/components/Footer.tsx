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
                { name: "Smart Contract Audits", href: "/services/audits" },
                { name: "Security Monitoring", href: "/services/monitoring" },
                { name: "Code Review", href: "/services/code-review" },
                { name: "Bug Bounty Programs", href: "/services/bug-bounty" }
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "Audit Reports", href: "/resources/reports" },
                { name: "Security Blog", href: "/blog" },
                { name: "Documentation", href: "/docs" },
                { name: "Common Vulnerabilities", href: "/resources/vulnerabilities" }
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Our Team", href: "/team" },
                { name: "Careers", href: "/careers" },
                { name: "Contact", href: "/contact" }
            ]
        }
    ];

    // Social media links
    const socialLinks = [
        { name: "GitHub", icon: <Github size={20} />, href: "https://github.com/r3sec" },
        { name: "Twitter", icon: <Twitter size={20} />, href: "https://twitter.com/r3sec" },
        { name: "LinkedIn", icon: <Linkedin size={20} />, href: "https://linkedin.com/company/r3sec" }
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
                {/* Newsletter & CTA Section */}
                <motion.div
                    className="max-w-5xl mx-auto mb-14"
                    variants={itemVariants}
                >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">
                                    Stay Updated on Solana Security
                                </h3>
                                <p className="text-zinc-400 mb-6">
                                    Get weekly security alerts, audit reports, and vulnerability insights delivered straight to your inbox.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white flex-grow focus:outline-none focus:border-green-500"
                                    />
                                    <motion.button
                                        className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-medium text-sm inline-flex items-center whitespace-nowrap"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Subscribe
                                        <ArrowRight size={16} className="ml-2" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="border-l border-zinc-800 pl-8 hidden md:block">
                                <div className="flex items-center mb-4">
                                    <MessageSquare size={20} className="text-green-400 mr-2" />
                                    <h4 className="font-semibold">Need an urgent audit?</h4>
                                </div>
                                <p className="text-zinc-400 mb-4 text-sm">
                                    Fast-track audits available for projects with imminent launches.
                                </p>
                                <motion.a
                                    href="/contact"
                                    className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg font-medium text-sm inline-flex items-center"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Schedule Consultation
                                    <ExternalLink size={14} className="ml-2" />
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </motion.div>

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
                            <a href="mailto:security@r3sec.com" className="hover:text-green-400 transition-colors">
                                security@r3sec.com
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
                            <a href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
                            <a href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
                            <a href="/legal" className="hover:text-zinc-300 transition-colors">Legal</a>
                        </div>
                        <span className="text-zinc-600 text-sm md:ml-6">© {new Date().getFullYear()} R3SEC. All rights reserved.</span>
                    </div>
                </motion.div>
            </motion.div>
        </footer>
    );
}
