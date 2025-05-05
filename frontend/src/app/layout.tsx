import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "R3SEC | Solana Smart Contract Security Audits",
    description:
        "R3SEC is a fast and developer-friendly platform for submitting Solana smart contracts for security audits, tracking audit progress, and downloading reports.",
    metadataBase: new URL("https://r3sec.xyz"), // update to your domain
    openGraph: {
        title: "R3SEC | Solana Smart Contract Security",
        description:
            "Submit Solana programs for security audits and get structured, professional reports from the R3SEC team.",
        url: "https://r3sec.xyz",
        siteName: "R3SEC",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "R3SEC Smart Contract Security Platform",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "R3SEC | Solana Security Audits",
        description:
            "Secure your Solana smart contracts with trusted audits from R3SEC.",
        images: ["/og-image.png"],
        creator: "@r0ckyr", // optional
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    viewport:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                    {children}
                </GoogleOAuthProvider>

            </body>
        </html>
    );
}

