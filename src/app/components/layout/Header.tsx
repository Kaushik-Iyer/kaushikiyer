'use client';

import Link from 'next/link';
import ThemeSwitcher from '@/app/components/ThemeSwitcher';
import { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="py-4 border-b border-accent/20 bg-background text-text relative">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:no-underline text-primary">
          Kaushik Iyer
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:block">
            <ul className="flex space-x-4 sm:space-x-6 text-sm sm:text-base">
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-primary transition-colors">Education</Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-primary transition-colors">Experience</Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
              </li>
            </ul>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-text hover:text-primary"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
          
          <ThemeSwitcher />
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu" 
          className="md:hidden absolute top-full right-4 mt-2 w-56 rounded-md border border-primary bg-[var(--color-background)] text-text shadow-lg z-20"
        >
          <nav className="p-2">
            <ul className="flex flex-col space-y-1 text-sm">
              <li>
                <Link href="/blog" className="block py-2 px-3 hover:bg-accent/10 hover:text-primary transition-colors rounded-md" onClick={toggleMobileMenu}>Blog</Link>
              </li>
              <li>
                <Link href="/projects" className="block py-2 px-3 hover:bg-accent/10 hover:text-primary transition-colors rounded-md" onClick={toggleMobileMenu}>Projects</Link>
              </li>
              <li>
                <Link href="/education" className="block py-2 px-3 hover:bg-accent/10 hover:text-primary transition-colors rounded-md" onClick={toggleMobileMenu}>Education</Link>
              </li>
              <li>
                <Link href="/experience" className="block py-2 px-3 hover:bg-accent/10 hover:text-primary transition-colors rounded-md" onClick={toggleMobileMenu}>Experience</Link>
              </li>
              <li>
                <Link href="/testimonials" className="block py-2 px-3 hover:bg-accent/10 hover:text-primary transition-colors rounded-md" onClick={toggleMobileMenu}>Testimonials</Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;