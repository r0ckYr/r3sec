import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
    AlertCircle,
    ArrowLeft,
    Check,
    Loader2,
    RefreshCw,
    Wallet,
    ExternalLink,
    DollarSign
} from "lucide-react";

const SolanaPayment = ({ plan, onPaymentSuccess, onBack }) => {
    // States with better organization
    const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, connecting, processing, verifying, success, failed
    const [error, setError] = useState(""); // Store detailed error messages
    const [walletInfo, setWalletInfo] = useState({
        connected: false,
        address: "",
        signature: ""
    });

    // Price states
    const [priceInfo, setPriceInfo] = useState({
        solPrice: plan.sol_price || null,
        solAmount: plan.price_sol || null,
        isLoading: !plan.sol_price
    });

    // Verification state
    const [verificationInfo, setVerificationInfo] = useState({
        attempts: 0,
        maxAttempts: 12, // 1 minute with 5-second intervals
        isVerifying: false,
        message: ""
    });

    // Environment constants
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
    const RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_ADDRESS || "EEpLbLqWVQ67qQ2wr6JiGZ5VEToNieEJChMYxPkokcij";

    // Get explorer URL based on network
    const getExplorerUrl = (sig) => {
        return `https://explorer.solana.com/tx/${sig}${NETWORK !== "mainnet-beta" ? `?cluster=${NETWORK}` : ""}`;
    };

    // Fetch SOL price from CoinGecko API
    const fetchSolPrice = useCallback(async () => {
        setPriceInfo(prev => ({ ...prev, isLoading: true }));
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
            if (!response.ok) {
                throw new Error('Failed to fetch SOL price');
            }
            const data = await response.json();
            const newSolPrice = data.solana.usd;

            // Calculate SOL amount based on USD price
            const newSolAmount = plan.price_usd / newSolPrice;

            setPriceInfo({
                solPrice: newSolPrice,
                solAmount: newSolAmount.toFixed(4),
                isLoading: false
            });
        } catch (err) {
            console.error('Error fetching SOL price:', err);
            toast.error('Could not load current SOL price. Using estimated price.');

            // Fallback price if API fails
            const fallbackSolPrice = 100;
            const fallbackSolAmount = plan.price_usd / fallbackSolPrice;

            setPriceInfo({
                solPrice: fallbackSolPrice,
                solAmount: fallbackSolAmount.toFixed(4),
                isLoading: false
            });
        }
    }, [plan.price_usd]);

    // Load SOL price on component mount if not provided
    useEffect(() => {
        if (!plan.sol_price) {
            fetchSolPrice();
        }
    }, [plan, fetchSolPrice]);

    // Check if Phantom wallet exists in the browser
    const getProvider = () => {
        if ("solana" in window && window.solana.isPhantom) {
            return window.solana;
        }

        // If wallet not found, open install page
        window.open("https://phantom.app/", "_blank");
        return null;
    };

    // Connect to Phantom wallet
    const connectWallet = async () => {
        try {
            setError(""); // Clear any previous errors
            setPaymentStatus("connecting");
            const provider = getProvider();

            if (!provider) {
                setError("Phantom wallet not detected. Please install the Phantom wallet extension first.");
                setPaymentStatus("failed");
                return;
            }

            const response = await provider.connect();
            const walletAddress = response.publicKey.toString();

            setWalletInfo({
                connected: true,
                address: walletAddress,
                signature: ""
            });

            setPaymentStatus("idle");
            toast.success("Wallet connected successfully!");
            toast.success(`Using Solana ${NETWORK === "mainnet-beta" ? "Mainnet" : "Devnet"}`);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            setError("Failed to connect wallet: " + (error.message || "Unknown error"));
            setPaymentStatus("failed");
        }
    };

    // Make payment using Solana
    const makePayment = async () => {
        try {
            setError(""); // Clear any previous errors
            const { solAmount } = priceInfo;

            if (!solAmount) {
                setError("SOL amount not calculated. Please refresh the page.");
                return;
            }

            setPaymentStatus("processing");
            const provider = getProvider();

            if (!provider) {
                setError("Phantom wallet not found. Please install it first.");
                setPaymentStatus("failed");
                return;
            }

            // Import from @solana/web3.js dynamically
            const solanaWeb3 = await import('@solana/web3.js');

            // Create a connection to the selected network
            const connection = new solanaWeb3.Connection(
                solanaWeb3.clusterApiUrl(NETWORK),
                'confirmed'
            );

            // Create transaction
            const transaction = new solanaWeb3.Transaction();
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = new solanaWeb3.PublicKey(walletInfo.address);

            // Add transfer instruction with the calculated SOL amount
            const transferInstruction = solanaWeb3.SystemProgram.transfer({
                fromPubkey: new solanaWeb3.PublicKey(walletInfo.address),
                toPubkey: new solanaWeb3.PublicKey(RECEIVER_ADDRESS),
                lamports: solanaWeb3.LAMPORTS_PER_SOL * parseFloat(solAmount),
            });

            transaction.add(transferInstruction);

            // Sign and send transaction
            const signedTransaction = await provider.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            setWalletInfo(prev => ({ ...prev, signature }));

            // Wait for confirmation
            await connection.confirmTransaction(signature, 'confirmed');

            // Begin verification process with backend
            setPaymentStatus("verifying");
            setVerificationInfo({
                attempts: 0,
                maxAttempts: 12,
                isVerifying: true,
                message: "Verifying payment with backend..."
            });

            // Start verification process
            verifyPaymentWithRetries(signature);

        } catch (error) {
            console.error("Payment error:", error);
            setPaymentStatus("failed");
            setError(error.message || "Payment failed. Please try again.");
            toast.error("Payment failed: " + (error.message || "Unknown error"));
        }
    };

    // Verify payment with backend with retry mechanism
    const verifyPaymentWithRetries = async (signature) => {
        // Reset verification info
        setVerificationInfo(prev => ({
            ...prev,
            attempts: 0,
            isVerifying: true,
            message: "Verifying payment with backend..."
        }));

        const startVerification = async () => {
            let currentAttempt = 0;
            const maxAttempts = 12; // Try for 1 minute (12 attempts * 5 seconds)
            let isSuccess = false;
            let lastError = "";
            let responseData = null;

            while (currentAttempt < maxAttempts && !isSuccess) {
                try {
                    currentAttempt++;
                    setVerificationInfo(prev => ({
                        ...prev,
                        attempts: currentAttempt,
                        message: `Verifying payment (attempt ${currentAttempt}/${maxAttempts})...`
                    }));

                    // Call backend verification endpoint
                    const response = await fetch(`${BACKEND_URL}/api/payments/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        },
                        body: JSON.stringify({
                            signature,
                            plan_id: plan.id,
                            wallet_address: walletInfo.address,
                            amount_sol: priceInfo.solAmount,
                            amount_usd: plan.price_usd,
                            sol_price_at_payment: priceInfo.solPrice,
                            network: NETWORK
                        })
                    });

                    // Check status code specifically for 200 OK
                    if (response.status === 200) {
                        responseData = await response.json();
                        isSuccess = true;
                        break;
                    } else {
                        // Parse error message from non-200 response
                        const errorData = await response.json().catch(() => ({}));
                        lastError = errorData.error || `Server returned status ${response.status}`;

                        // If this is not the last attempt, wait 5 seconds before retrying
                        if (currentAttempt < maxAttempts) {
                            await new Promise(resolve => setTimeout(resolve, 5000));
                        }
                    }
                } catch (error) {
                    console.error(`Verification attempt ${currentAttempt} failed:`, error);
                    lastError = error.message || "Network error during verification";

                    // If this is not the last attempt, wait 5 seconds before retrying
                    if (currentAttempt < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                }
            }

            // Handle the outcome
            setVerificationInfo(prev => ({ ...prev, isVerifying: false }));

            if (isSuccess && responseData) {
                // Verification successful - proceed with onPaymentSuccess
                setPaymentStatus("success");
                toast.success("Payment verified successfully!");

                // Extract payment data from the response - this is the structure from the backend
                const paymentData = responseData.payment;

                if (paymentData) {
                    // Pass the complete payment data to onPaymentSuccess, using data from the API response
                    setTimeout(() => {
                        onPaymentSuccess({
                            // Include original plan info
                            ...plan,
                            // Use API payment data (with fallbacks for safety)
                            payment_id: paymentData.id,
                            signature: paymentData.signature || signature,
                            wallet_address: paymentData.wallet_address || walletInfo.address,
                            amount_sol: paymentData.amount_sol,
                            amount_usd: paymentData.amount_usd || plan.price_usd,
                            price_sol: paymentData.amount_sol, // For consistency with expected props
                            sol_price: paymentData.sol_price_at_payment,
                            sol_price_at_payment: paymentData.sol_price_at_payment,
                            network: paymentData.network || NETWORK,
                            status: paymentData.status || "verified",
                            verified_at: paymentData.verified_at || new Date().toISOString()
                        });
                    }, 2000);
                } else {
                    // Fallback if payment data is missing for some reason
                    setTimeout(() => {
                        onPaymentSuccess({
                            ...plan,
                            price_sol: priceInfo.solAmount,
                            sol_price: priceInfo.solPrice,
                            signature: signature,
                            payment_id: signature
                        });
                    }, 2000);
                }
            } else {
                // Verification failed after all attempts
                setPaymentStatus("failed");
                setError(`Payment verification failed after ${maxAttempts} attempts. ${lastError}`);
                toast.error("Payment verification failed. Please contact support with your transaction signature.");

                // For devnet testing only - remove in production
                if (NETWORK === "devnet") {
                    console.log("Simulating successful verification for development");

                    // Add a button for users to force success in devnet (for development only)
                    setError(`Payment verification failed. This is a devnet transaction. ${lastError}`);
                }
            }
        };

        // Start the verification process
        startVerification();
    };

    // Render component
    return (
        <div className="p-6 max-w-md mx-auto">
            {/* Header with back button */}
            <div className="mb-6 flex items-center">
                <button
                    onClick={onBack}
                    className="text-zinc-400 hover:text-white transition-colors mr-2"
                >
                    <ArrowLeft size={18} />
                </button>
                <h2 className="text-xl font-bold text-white">Complete Payment</h2>
            </div>

            {/* Payment details card */}
            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">{plan.name} Plan</h3>
                        <p className="text-zinc-400 text-sm">Security Audit</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end">
                            <DollarSign size={16} className="text-green-400" />
                            <p className="text-xl font-bold text-white">{plan.price_usd}</p>
                        </div>
                        <div className="flex items-center justify-end mt-1">
                            <p className="text-zinc-400 text-sm">
                                {priceInfo.isLoading ? (
                                    <span className="flex items-center">
                                        <RefreshCw size={10} className="animate-spin mr-1" />
                                        Loading...
                                    </span>
                                ) : (
                                    `≈ ${priceInfo.solAmount} SOL`
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Receiver address */}
                <div className="border-t border-zinc-800 pt-4 mt-4">
                    <p className="text-zinc-400 text-sm mb-2">You are paying:</p>
                    <p className="text-white font-mono break-all">{RECEIVER_ADDRESS}</p>
                </div>

                {/* Network and price info */}
                <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                    <div>
                        <p className="text-zinc-400 text-sm mb-1">Network:</p>
                        <div className="flex items-center space-x-2">
                            <span className={`h-2 w-2 rounded-full ${NETWORK === "mainnet-beta" ? "bg-green-500" : "bg-purple-500"}`}></span>
                            <p className="text-white">{NETWORK === "mainnet-beta" ? "Solana Mainnet" : "Solana Devnet"}</p>
                        </div>
                    </div>

                    {/* SOL Price indicator */}
                    <div className="text-right">
                        <p className="text-zinc-400 text-sm mb-1">Current SOL Price:</p>
                        <p className="text-white">
                            {priceInfo.isLoading ? (
                                <span className="flex items-center justify-end">
                                    <RefreshCw size={12} className="animate-spin mr-1" />
                                    Loading...
                                </span>
                            ) : (
                                <span className="flex items-center justify-end">
                                    ${priceInfo.solPrice}
                                    <button
                                        onClick={fetchSolPrice}
                                        className="ml-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                        title="Refresh SOL price"
                                    >
                                        <RefreshCw size={12} />
                                    </button>
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment action area */}
            <div className="space-y-4">
                {!walletInfo.connected ? (
                    <button
                        onClick={connectWallet}
                        disabled={paymentStatus === "connecting"}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center justify-center space-x-2 disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors"
                    >
                        {paymentStatus === "connecting" ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Connecting...</span>
                            </>
                        ) : (
                            <>
                                <Wallet size={20} />
                                <span>Connect Phantom Wallet</span>
                            </>
                        )}
                    </button>
                ) : (
                    <>
                        {/* Wallet connected status */}
                        <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Check size={16} className="text-green-400" />
                                <span className="text-zinc-300">Wallet Connected</span>
                            </div>
                            <p className="text-zinc-400 text-sm font-mono truncate max-w-[150px]">
                                {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
                            </p>
                        </div>

                        {/* Pay button */}
                        <button
                            onClick={makePayment}
                            disabled={
                                paymentStatus === "processing" ||
                                paymentStatus === "verifying" ||
                                paymentStatus === "success" ||
                                priceInfo.isLoading
                            }
                            className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${paymentStatus === "success"
                                ? "bg-green-600 text-white cursor-default"
                                : "bg-purple-600 hover:bg-purple-500 text-white disabled:bg-purple-800 disabled:cursor-not-allowed"
                                }`}
                        >
                            {paymentStatus === "processing" ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Processing Payment...</span>
                                </>
                            ) : paymentStatus === "verifying" ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>
                                        Verifying Payment... ({verificationInfo.attempts}/{verificationInfo.maxAttempts})
                                    </span>
                                </>
                            ) : paymentStatus === "success" ? (
                                <>
                                    <Check size={20} />
                                    <span>Payment Successful</span>
                                </>
                            ) : priceInfo.isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Calculating SOL amount...</span>
                                </>
                            ) : (
                                <>
                                    <Wallet size={20} />
                                    <span>Pay ${plan.price_usd} (≈ {priceInfo.solAmount} SOL)</span>
                                </>
                            )}
                        </button>

                        {/* Failed payment status */}
                        {paymentStatus === "failed" && (
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-start space-x-3">
                                <AlertCircle size={20} className="text-red-400 mt-0.5" />
                                <div>
                                    <p className="text-white font-medium">Payment Failed</p>
                                    <p className="text-zinc-400 text-sm mt-1">
                                        {error || "Please try again or use a different payment method."}
                                    </p>
                                    <div className="mt-2 flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                setPaymentStatus("idle");
                                                setError("");
                                            }}
                                            className="flex items-center text-red-400 hover:text-red-300 text-sm"
                                        >
                                            <RefreshCw size={14} className="mr-1" />
                                            Try Again
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transaction signature */}
                        {walletInfo.signature && (
                            <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
                                <p className="text-zinc-400 text-sm mb-2">Transaction Signature:</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-zinc-300 font-mono text-xs truncate">
                                        {walletInfo.signature.slice(0, 16)}...{walletInfo.signature.slice(-16)}
                                    </p>
                                    <a
                                        href={getExplorerUrl(walletInfo.signature)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-400 hover:text-purple-300 flex items-center text-sm"
                                    >
                                        View <ExternalLink size={14} className="ml-1" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SolanaPayment;
