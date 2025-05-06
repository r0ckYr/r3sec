import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "R3SEC Admin Panel",
    description: "Secure admin dashboard for managing R3SEC tools and user operations.",
    keywords: ["R3SEC", "admin", "dashboard", "security tools", "solana", "smart contract auditing"],
    authors: [{ name: "R3SEC Team", url: "https://r3sec.xyz" }],
    creator: "R3SEC",
    metadataBase: new URL("https://admin.r3sec.xyz"),
    openGraph: {
        title: "R3SEC Admin Panel",
        description: "Securely manage R3SEC's smart contract security tools.",
        url: "https://admin.r3sec.xyz",
        siteName: "R3SEC Admin",
        images: [
            {
                url: "https://r3sec.xyz/og-image.png",
                width: 1200,
                height: 630,
                alt: "R3SEC Admin Dashboard",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "R3SEC Admin Panel",
        description: "Securely manage R3SEC's smart contract security tools.",
        creator: "@r3sec_xyz",
        images: ["https://r3sec.xyz/og-image.png"],
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    robots: {
        index: false, // You likely want this off for an admin panel
        follow: false,
        nocache: true,
    },
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
                {children}
            </body>
        </html>
    );
}

