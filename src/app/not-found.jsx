"use client";
import Link from "next/link";

import React from 'react';

export default function RootNotFound() {
    return (
        <html lang="en">
            <body className="flex items-center justify-center min-h-screen bg-white font-sans">
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-24 h-24 mb-12 rounded-full border border-amber-200 bg-amber-50">
                            <span className="text-amber-600 text-4xl">!</span>
                        </div>

                        <div className="mb-6">
                            <span className="text-sm font-light uppercase tracking-[0.3em] text-amber-700 bg-amber-50 px-4 py-2 border border-amber-100/50">
                                Error Code: 404
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extralight text-gray-800 mb-8 tracking-tight">
                            Exhibit Not Found
                        </h1>

                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8" />

                        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-12">
                            The page you are looking for is not found :(
                        </p>

                        <div className="flex justify-center">
                            <Link
                                href="/"
                                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white font-light py-4 px-8 uppercase tracking-widest text-sm transition-all hover:scale-105 hover:shadow-xl shadow-amber-500/25"
                            >
                                Back to Home Page
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl opacity-30" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-100/30 rounded-full blur-3xl opacity-20" />
                </div>
            </body>
        </html>
    );
}
