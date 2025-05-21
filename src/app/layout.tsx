import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css"; // Correct path relative to this file
import { ThemeProvider } from "next-themes";
import ThemeSwitcher from "@/app/components/ThemeSwitcher"; // Path to the new component

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
      <body className={`${inter.className} bg-background text-text`}> {/* Applied Inter, and Tailwind classes for base theme colors */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // You can change this default
          themes={["light", "dark", "theme-blue", "theme-green", "theme-red"]}
          storageKey="portfolio-theme" // Unique storage key
          enableSystem={false} // Disable system preference to give full control to switcher
        >
          <div className="min-h-screen flex flex-col">
            <ThemeSwitcher /> {/* Position the theme switcher appropriately */}
            <main className="flex-grow">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}