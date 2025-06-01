"use client"; // Add this at the top

import Link from 'next/link';
import ThemeSwitcher from '@/app/components/ThemeSwitcher';
import { useState } from 'react'; // Import useState

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="py-4 border-b border-accent/20 bg-background text-text sticky top-0 z-50">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:no-underline text-primary" onClick={closeMobileMenu}>
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
          
          <ThemeSwitcher />
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-text hover:text-primary z-20" // Ensure button is clickable
            onClick={toggleMobileMenu}
            aria-label="Toggle menu" // Accessibility
          >
            {isMobileMenuOpen ? (
              // Close icon (X)
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border border-primary rounded-md shadow-xl z-50 mx-4 mt-2"> 
          {/* Applied border, border-primary, rounded-md. Added mx-4 and mt-2 for spacing from edges and header. Made background fully opaque */}
          <nav className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
            <ul className="flex flex-col space-y-2 text-left"> {/* Changed space-y-4 to space-y-2 and text-center to text-left */}
              <li>
                <Link href="/blog" className="block py-2 px-3 hover:bg-accent/10 rounded-md hover:text-primary transition-colors" onClick={closeMobileMenu}>Blog</Link>
              </li>
              <li>
                <Link href="/projects" className="block py-2 px-3 hover:bg-accent/10 rounded-md hover:text-primary transition-colors" onClick={closeMobileMenu}>Projects</Link>
              </li>
              <li>
                <Link href="/education" className="block py-2 px-3 hover:bg-accent/10 rounded-md hover:text-primary transition-colors" onClick={closeMobileMenu}>Education</Link>
              </li>
              <li>
                <Link href="/experience" className="block py-2 px-3 hover:bg-accent/10 rounded-md hover:text-primary transition-colors" onClick={closeMobileMenu}>Experience</Link>
              </li>
              <li>
                <Link href="/testimonials" className="block py-2 px-3 hover:bg-accent/10 rounded-md hover:text-primary transition-colors" onClick={closeMobileMenu}>Testimonials</Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;