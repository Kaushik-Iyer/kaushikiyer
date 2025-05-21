import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css"; // Correct path relative to this file
import { ThemeProvider } from "next-themes";
import ThemeSwitcher from "@/app/components/ThemeSwitcher"; 

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}> 
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          themes={["light", "dark", "theme-blue", "theme-green", "theme-red", "theme-neon"]} 
          storageKey="portfolio-theme" 
          enableSystem={false} 
        >
          <div className="min-h-screen flex flex-col">
            <ThemeSwitcher /> 
            <main className="flex-grow">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}