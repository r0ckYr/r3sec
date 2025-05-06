"use client";
import React from 'react';
import AdminLogin from './auth/login/page';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Background elements that appear across the entire page */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-pink-300/10 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-pink-400/10 blur-3xl"></div>
                <div className="absolute top-1/2 right-1/3 w-56 h-56 rounded-full bg-pink-200/10 blur-3xl"></div>
            </div>

            {/* Page content */}
            <div className="relative z-10">
                <AdminLogin />
            </div>
        </div>
    );
}
