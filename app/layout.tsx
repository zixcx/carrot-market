import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: "%s | 당근마켓",
        default: "당근마켓",
    },
    description: "Sell and buy all the things",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`text-white bg-neutral-900 max-w-screen-sm mx-auto`}
            >
                {children}
            </body>
        </html>
    );
}
