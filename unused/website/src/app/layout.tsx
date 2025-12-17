import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "next-themes";
// import Footer from "@/ui/Footer";
import NavBar from "@/ui/NavBar";
import React from "react";
import NavProgress from "@/ui/NProgress";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Wondamart Data Solutions",
    description: "Elevate your browsing, and connectivity experience by simply choosing Wondamart for all your data needs.",
    metadataBase: new URL("https://wondamartgh.com")
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <NavProgress>
                <NavBar />
                {children}
                {/* <Footer /> */}
            </NavProgress>
        </ThemeProvider>
        </body>
        </html>
    );
}
