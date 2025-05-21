import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css"; // Correct path relative to this file

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Kaushik Iyer - Portfolio",
  description: "Personal portfolio of Kaushik Iyer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}