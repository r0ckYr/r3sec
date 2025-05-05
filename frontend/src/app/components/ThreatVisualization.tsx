import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Shield, Bug, Target, CheckCircle, XCircle } from "lucide-react";

export default function ThreatVisualization() {
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

    const attackFlowVariants = {
        initial: { pathLength: 0, opacity: 0 },
        animate: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 1.5, ease: "easeInOut" }
        }
    };

    // Sample vulnerabilities
    const vulnerabilities = [
        {
            id: 1,
            title: "Reentrancy Attacks",
            description: "Attackers exploit function calls that can be interrupted and re-entered before the first execution completes.",
            impact: "$150M+ lost across protocols",
            icon: <Bug className="h-6 w-6" />
        },
        {
            id: 2,
            title: "Logic Flaws",
            description: "Exploiting unintended contract behavior through edge cases or incorrect state handling.",
            impact: "$320M+ in protocol damages",
            icon: <Target className="h-6 w-6" />
        },
        {
            id: 3,
            title: "Access Control Issues",
            description: "Unauthorized users gaining privileged access due to improper permission management.",
            impact: "$75M+ stolen from DAOs",
            icon: <AlertTriangle className="h-6 w-6" />
        }
    ];

    // Protection features
    const protectionFeatures = [
        {
            id: 1,
            title: "Automatic Vulnerability Scanning",
            description: "Our system scans your code for 50+ known vulnerability patterns specific to Solana's architecture.",
            icon: <Shield className="h-6 w-6" />
        },
        {
            id: 2,
            title: "Expert Manual Review",
            description: "Verified auditors with Solana expertise examine your contract logic for complex security issues.",
            icon: <CheckCircle className="h-6 w-6" />
        },
        {
            id: 3,
            title: "Real-world Attack Simulation",
            description: "We test your contracts against simulated attacks based on previously successful exploits.",
            icon: <XCircle className="h-6 w-6" />
        }
    ];

    return (
        <div className="bg-zinc-950 text-white py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    className="max-w-4xl mx-auto text-center mb-16"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            <span className="text-green-400">Security Threats</span> vs{" "}
                            <span className="text-white">R3SEC Protection</span>
                        </h2>
                    </motion.div>
                    <motion.p
                        className="text-lg text-zinc-400 mb-10"
                        variants={itemVariants}
                    >
                        Smart contract vulnerabilities cost the Solana ecosystem millions annually.
                        See how attackers operate and how our solutions protect your code.
                    </motion.p>
                </motion.div>

                {/* Attack Visualization Section */}
                <motion.div
                    className="max-w-5xl mx-auto mb-20 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 overflow-hidden">
                        <div className="flex flex-col md:flex-row justify-between relative">
                            {/* Left Side - Vulnerable Contract */}
                            <motion.div
                                className="w-full md:w-5/12 mb-10 md:mb-0"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="bg-zinc-800 border border-red-500/30 rounded-lg p-6 relative">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                        Vulnerable Contract
                                    </h3>

                                    <div className="font-mono text-sm bg-zinc-950 rounded p-4 text-zinc-300 overflow-x-auto">
                                        <pre className="relative">
                                            <code>
                                                <span className="text-blue-400">pub fn</span> <span className="text-green-400">process_withdraw</span>(<span className="text-orange-300">ctx</span>: Context&lt;Withdraw&gt;) -&gt; ProgramResult {'{'}
                                                <br />
                                                <span className="text-zinc-500">  // Missing access controls</span>
                                                <br />
                                                <span className="text-zinc-500">  // No input validation</span>
                                                <br />
                                                <span className="text-blue-400">  let</span> amount = ctx.accounts.user_data.amount;
                                                <br />
                                                <span className="text-zinc-500">  // Transfer before state update</span>
                                                <br />
                                                <span className="text-blue-400">  let</span> ix = transfer(
                                                <br />
                                                <span className="ml-4">ctx.accounts.vault.key,</span>
                                                <br />
                                                <span className="ml-4">ctx.accounts.user.key,</span>
                                                <br />
                                                <span className="ml-4">amount</span>
                                                <br />
                                                <span className="text-zinc-500 ml-2">);</span>
                                                <br />
                                                <br />
                                                <span className="text-blue-400">  invoke</span>(
                                                <br />
                                                <span className="ml-4">&amp;ix,</span>
                                                <br />
                                                <span className="ml-4">&amp;[&thinsp;/* account infos */&thinsp;]</span>
                                                <br />
                                                <span className="text-zinc-500 ml-2">)?;</span>
                                                <br />
                                                <br />
                                                <span className="text-zinc-500">  // State update happens too late</span>
                                                <br />
                                                <span className="text-blue-400">  ctx</span>.accounts.user_data.amount = 0;
                                                <br />
                                                <span className="text-zinc-500">  Ok(())</span>
                                                <br />
                                                {'}'}
                                            </code>
                                        </pre>
                                    </div>

                                    <motion.div
                                        className="absolute -right-10 top-1/2 transform -translate-y-1/2 hidden md:block text-red-500"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <AlertTriangle size={24} />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Middle - Attack Flow */}
                            <motion.div
                                className="hidden md:flex items-center justify-center w-2/12 relative"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                <svg width="100%" height="160" viewBox="0 0 100 160" fill="none">
                                    <motion.path
                                        d="M 0,80 C 30,40 70,120 100,80"
                                        stroke="#EF4444"
                                        strokeWidth="2"
                                        strokeDasharray="6 4"
                                        variants={attackFlowVariants}
                                        initial="initial"
                                        animate="animate"
                                        fill="none"
                                    />
                                    <motion.path
                                        d="M 92,80 L 100,80 L 95,88"
                                        stroke="#EF4444"
                                        strokeWidth="2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.5 }}
                                        fill="none"
                                    />
                                </svg>

                                <motion.div
                                    className="absolute top-1/2 transform -translate-y-1/2 bg-red-500/10 p-2 rounded-full"
                                    animate={{
                                        boxShadow: ["0 0 0px rgba(239, 68, 68, 0.2)", "0 0 20px rgba(239, 68, 68, 0.6)", "0 0 0px rgba(239, 68, 68, 0.2)"]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Target size={24} className="text-red-500" />
                                </motion.div>
                            </motion.div>

                            {/* Right Side - Attacker */}
                            <motion.div
                                className="w-full md:w-5/12"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                        Attacker Exploitation
                                    </h3>

                                    <ul className="space-y-4">
                                        <motion.li
                                            className="flex items-start"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.2 }}
                                        >
                                            <div className="bg-red-500/10 p-1 rounded-full mr-3 mt-1">
                                                <span className="text-red-500 font-bold text-xs">1</span>
                                            </div>
                                            <p className="text-zinc-300 text-sm">
                                                Identifies missing input validation and state management issues
                                            </p>
                                        </motion.li>

                                        <motion.li
                                            className="flex items-start"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.5 }}
                                        >
                                            <div className="bg-red-500/10 p-1 rounded-full mr-3 mt-1">
                                                <span className="text-red-500 font-bold text-xs">2</span>
                                            </div>
                                            <p className="text-zinc-300 text-sm">
                                                Creates a crafted transaction to repeatedly call withdraw() before state update
                                            </p>
                                        </motion.li>

                                        <motion.li
                                            className="flex items-start"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.8 }}
                                        >
                                            <div className="bg-red-500/10 p-1 rounded-full mr-3 mt-1">
                                                <span className="text-red-500 font-bold text-xs">3</span>
                                            </div>
                                            <p className="text-zinc-300 text-sm">
                                                Drains contract funds through multiple withdrawals of the same funds
                                            </p>
                                        </motion.li>
                                    </ul>

                                    <motion.div
                                        className="mt-4 bg-red-500/5 border border-red-500/20 rounded p-3 flex items-center"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 2.1 }}
                                    >
                                        <AlertTriangle size={18} className="text-red-500 mr-2 flex-shrink-0" />
                                        <p className="text-sm text-red-200">
                                            Result: Protocol loses all funds within minutes of deployment
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Prevention/Protection */}
                        <motion.div
                            className="mt-12 pt-8 border-t border-zinc-800"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.4, duration: 0.6 }}
                        >
                            <h3 className="text-xl font-semibold mb-6 flex items-center">
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                <span className="text-green-400">R3SEC</span> Protection Layer
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div
                                    className="bg-zinc-950 rounded-lg p-4 border border-green-500/20"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="bg-green-500/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                                        <Shield size={20} className="text-green-400" />
                                    </div>
                                    <h4 className="font-medium mb-2">Static Analysis</h4>
                                    <p className="text-zinc-400 text-sm">
                                        Automatically detects common vulnerabilities like missing checks and reentrancy risks
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="bg-zinc-950 rounded-lg p-4 border border-green-500/20"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="bg-green-500/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                                        <CheckCircle size={20} className="text-green-400" />
                                    </div>
                                    <h4 className="font-medium mb-2">Manual Review</h4>
                                    <p className="text-zinc-400 text-sm">
                                        Expert auditors verify program logic and detect complex security issues before deployment
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="bg-zinc-950 rounded-lg p-4 border border-green-500/20"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="bg-green-500/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                                        <Bug size={20} className="text-green-400" />
                                    </div>
                                    <h4 className="font-medium mb-2">Simulation Testing</h4>
                                    <p className="text-zinc-400 text-sm">
                                        Tests contracts against known exploitation patterns with advanced fuzzing techniques
                                    </p>
                                </motion.div>
                            </div>

                            <motion.div
                                className="mt-6 bg-green-500/5 border border-green-500/20 rounded p-4 flex items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.7 }}
                            >
                                <Shield size={20} className="text-green-500 mr-3 flex-shrink-0" />
                                <p className="text-sm text-zinc-300">
                                    R3SEC would have detected these vulnerabilities <span className="font-semibold text-green-400">before deployment</span>,
                                    preventing loss of funds and maintaining protocol trust
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Common Vulnerabilities */}
                <motion.div
                    className="max-w-5xl mx-auto mb-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-2xl font-bold text-center mb-10">
                        Real Threats to <span className="text-green-400">Solana</span> Smart Contracts
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {vulnerabilities.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <motion.div
                                    className="absolute top-0 left-0 h-1 bg-red-500"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                                    viewport={{ once: true }}
                                />

                                <div className="flex items-center mb-4">
                                    <div className="bg-red-500/10 p-2 rounded-full mr-3 text-red-500">
                                        {item.icon}
                                    </div>
                                    <h4 className="font-semibold text-lg">{item.title}</h4>
                                </div>

                                <p className="text-zinc-400 text-sm mb-4">
                                    {item.description}
                                </p>

                                <div className="bg-zinc-950 rounded p-3 text-red-300 text-sm font-medium">
                                    {item.impact}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Protection Features */}
                <motion.div
                    className="max-w-5xl mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h3 className="text-2xl font-bold text-center mb-10">
                        How <span className="text-green-400">R3SEC</span> Protects Your Contracts
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {protectionFeatures.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <motion.div
                                    className="absolute top-0 left-0 h-1 bg-green-500"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                                    viewport={{ once: true }}
                                />

                                <div className="flex items-center mb-4">
                                    <div className="bg-green-500/10 p-2 rounded-full mr-3 text-green-400">
                                        {item.icon}
                                    </div>
                                    <h4 className="font-semibold text-lg">{item.title}</h4>
                                </div>

                                <p className="text-zinc-400 text-sm">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="text-center mt-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <motion.button
                            className="bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-lg font-medium text-lg inline-flex items-center"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => { window.location.href = '/auth/register' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Secure Your Code Now
                            <motion.div
                                className="ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <Shield size={18} />
                            </motion.div>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
